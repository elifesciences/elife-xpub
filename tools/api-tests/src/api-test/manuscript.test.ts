import { test, TestContext } from "ava-ts";
import dashboard from "../xpub-api/dashboard";
import submission from "../xpub-api/submission";
import user from '../xpub-api/user';
import { defaultConfig } from "../xpub-api";
import { Manuscript, ManuscriptInput } from "../generated/graphql";
import { stripTypeNameFromJson } from "../utils";

test.beforeEach(async _ => {
  await user.Query.currentUser(defaultConfig());
});

test("The user can save a submission and the manuscripts endpoint now includes it", async (t: TestContext) => {

  const context = defaultConfig();

  const initialManuscripts = await dashboard.Query.manuscripts(context);

  const newManuscript = await dashboard.Mutation.createManuscript(context);

  const manuscriptAuthorDelta: ManuscriptInput = {
    id: newManuscript.createManuscript.id,
    cosubmission: ["some_other_submission"],
    meta: {
      title: `A test manuscript generated ${new Date().toISOString()}`,
      articleType: "TEST",
      subjects: [],
    },
    author: {
      firstName: "Bobby",
      lastName: "Beans",
      email: "bobbybe@ns.com",
      aff: "University of Bean Studies",
    },
  };

  // TODO: Test updating other fields in the form - really exercise those database relations!
  const savedManuscript = await submission.Mutation.updateSubmission(context, {
    data: manuscriptAuthorDelta,
  });

  const afterUpdating = await dashboard.Query.manuscripts(context);

  // Check that the user has a new manuscript
  t.truthy(
    initialManuscripts.manuscripts.length < afterUpdating.manuscripts.length,
    "there are more manuscripts after a new one is created",
  );

  // Check that the new manuscript exists in the users new manuscripts
  t.truthy(
    afterUpdating.manuscripts.filter(
      (manuscript: Manuscript) => manuscript.id === savedManuscript.updateSubmission.id,
    ).length === 1,
    "the new manuscript exists in the updated list of manuscripts",
  );

  // Check that the new manuscript does not exist in the user's old manuscript list
  t.truthy(
    initialManuscripts.manuscripts.filter(
      (manuscript: Manuscript) => manuscript.id === savedManuscript.updateSubmission.id,
    ).length === 0,
    "the new manuscript does not exist in the original list",
  );

  const expectedUpdatedManuscript: Manuscript | ManuscriptInput = {
    ...newManuscript.createManuscript,
    ...(manuscriptAuthorDelta as Manuscript),
    suggestedReviewers: [],
  };

  // Check that the stored manuscript matches the original
  // NOTE: The server adds __typename properties that aren't defined in our schema
  // and aren't used anywhere, so we strip them out to check that the stuff we depend on
  // is right
  t.deepEqual(
    stripTypeNameFromJson(savedManuscript.updateSubmission),
    stripTypeNameFromJson(expectedUpdatedManuscript),
    "the manuscript that is saved is the same as the original manuscript",
  );
});

test("can save editors", async (t: TestContext) => {
  const context = defaultConfig();

  const newManuscript = await dashboard.Mutation.createManuscript(context);

  const manuscriptAuthorDelta: ManuscriptInput = {
    id: newManuscript.createManuscript.id,
    cosubmission: ["some_other_submission"],
    meta: {
      title: `A manucript to test saving editors - generated: ${new Date().toISOString()} on ${
        newManuscript.createManuscript.id
      }`,
      articleType: "TEST",
      subjects: [],
    },
    author: {
      firstName: "Bobby",
      lastName: "Beans",
      email: "bobbybe@ns.com",
      aff: "University of Bean Studies",
    },
  };

  // Test adding some new editors
  const manuscriptEditorsDelta: ManuscriptInput = {
    ...manuscriptAuthorDelta,
    id: newManuscript.createManuscript.id,
    cosubmission: ["some_other_submission"],
    // Hard coding values here doesn't give me the warm-fuzzies
    suggestedSeniorEditors: ["bcooper", "fbloggs"],
    suggestedReviewingEditors: ["djones", "jqpublic"],
    suggestedReviewers: [
      {
        name: "Some Other",
        email: "guy@example.com",
      },
      {
        name: "",
        email: "",
      },
    ],
  };

  // These reviews should resolve to
  const hydratedTeams = {
    suggestedReviewingEditors: [
      {
        id: "djones",
        name: "Dai Jones",
        aff: null,
        focuses: ["Cell polarity"],
        expertises: ["Cell Biology"],
      },
      {
        id: "jqpublic",
        name: "John Q. Public",
        aff: null,
        focuses: ["Endocytosis", "Secretion"],
        expertises: ["Cell Biology"],
      },
    ],
    suggestedSeniorEditors: [
      {
        id: "bcooper",
        name: "Ben Cooper",
        aff: null,
        focuses: [
          "Population biology of communicable diseases",
          "Antimicrobial resistance",
          "Epidemiological methods",
        ],
        expertises: ["Computational and Systems Biology", "Epidemiology and Global Health"],
      },
      {
        id: "fbloggs",
        name: "Fred Bloggs III",
        aff: null,
        focuses: [],
        expertises: [],
      },
    ],
    suggestedReviewers: [
      {
        name: "Some Other",
        email: "guy@example.com",
      },
      {
        name: "",
        email: "",
      },
    ],
  };

  const savedManuscript = await submission.Mutation.updateSubmission(context, {
    data: manuscriptEditorsDelta,
  });

  const expectedUpdatedManuscript: Manuscript = {
    ...newManuscript.createManuscript,
    ...(manuscriptAuthorDelta as Manuscript),
    ...hydratedTeams,
  };

  const fetchedManuscript = await submission.Query.getSubmission(context, {  id: newManuscript.createManuscript.id });

  // NOTE: The server adds __typename properties for use internally, we don't need to assert on them so I've
  // removed them
  t.deepEqual(
    stripTypeNameFromJson(expectedUpdatedManuscript),
    stripTypeNameFromJson(savedManuscript.updateSubmission),
    "the saved manuscript contains the correct teams data",
  );

  t.deepEqual(
    // Huh?: why do we get suggestions back with this one and not the other request?
    stripTypeNameFromJson({...expectedUpdatedManuscript, suggestions: {}}),
    stripTypeNameFromJson(fetchedManuscript.manuscript),
    "the fetched manuscript contains the correct teams data",
  );
});
