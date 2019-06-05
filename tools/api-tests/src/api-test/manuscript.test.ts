import { test, TestContext } from "ava-ts";
import dashboard from "../xpub-api/dashboard";
import submission from "../xpub-api/submission";
import { defaultConfig } from "../xpub-api";
import { Manuscript, ManuscriptInput} from "../generated/graphql";

test.todo("The user can submit a manuscript, and other queries update correctly");

test.only(
  "The user can save a submission and the manuscripts endpoint now includes it",
  async (t: TestContext) => {
    const context = defaultConfig();

    const initialManuscripts = await dashboard.Query.manuscripts(context);

    const newManuscript = await dashboard.Mutation.createManuscript(context);

    console.log(newManuscript);

    const manuscriptAuthorDelta: ManuscriptInput = {
      id: newManuscript.createManuscript.id,
      cosubmission: ['some_other_submission'],
      author: {
        firstName: "Bobby",
        lastName: "Beans",
        email: "bobbybe@ns.com",
        aff: 'University of Bean Studies',
      },
    };

    // TODO: Test updating other fields in the form - really exercise those database relations!
    const savedManuscript = await submission.Mutation.updateManuscript(context, {data: manuscriptAuthorDelta});

    const afterUpdating = await dashboard.Query.manuscripts(context);

    // Check that the user has a new manuscript
    t.truthy(
      initialManuscripts.manuscripts.length < afterUpdating.manuscripts.length,
      "there are more manuscripts after a new one is created",
    );

    // Check that the new manuscript exists in the users new manuscripts
    t.truthy(
      afterUpdating.manuscripts.filter(
        (manuscript: Manuscript) => manuscript.id === savedManuscript.updateManuscript.id,
      ).length === 1,
      "the new manuscript exists in the updated list of manuscripts",
    );

    // Check that the new manuscript does not exist in the user's old manuscript list
    t.truthy(
      initialManuscripts.manuscripts.filter(
        (manuscript: Manuscript) => manuscript.id === savedManuscript.updateManuscript.id,
      ).length === 0,
      "the new manuscript does not exist in the original list",
    );

    const expectedUpdatedManuscript: Manuscript = {
      ...newManuscript.createManuscript,
      ...manuscriptAuthorDelta as Manuscript,
    }

    // Check that the stored manuscript matches the original
    console.log(savedManuscript.updateManuscript.author);
    console.log(expectedUpdatedManuscript.author);
    t.deepEqual(
      savedManuscript.updateManuscript,
      expectedUpdatedManuscript,
      "the manuscript that is saved is the same as the original manuscript",
    );
  },
);
