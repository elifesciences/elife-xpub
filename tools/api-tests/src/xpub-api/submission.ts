/**
 * Helpers for component-submission
 */

import { ApiTestContext } from "./index";
// import { GraphQLClient} from 'graphql-request';
import { Manuscript, QueryManuscriptArgs, MutationUpdateSubmissionArgs, EditorAlias } from "../generated/graphql";
import { withAuthorization, NotImplementedError } from "../utils";

/**
 * Gets a manuscript
 */
const manuscript = async (_ctx: ApiTestContext): Promise<Manuscript> => {
  throw new NotImplementedError();
};

const getSubmission = async (ctx: ApiTestContext, data: QueryManuscriptArgs ): Promise<{manuscript: Manuscript}> => {
  const query = `
query getSubmission($id: ID!) {
  manuscript(id: $id) {
    ...WholeManuscript
    __typename
  }
}

fragment WholeManuscript on Manuscript {
  id
  clientStatus
  meta {
    title
    articleType
    subjects
    __typename
  }
  lastStepVisited
  suggestedSeniorEditors: assignees(role: "suggestedSeniorEditor") {
    ...EditorDetails
    __typename
  }
  opposedSeniorEditors: assignees(role: "opposedSeniorEditor") {
    ...EditorDetails
    __typename
  }
  opposedSeniorEditorsReason
  suggestedReviewingEditors: assignees(role: "suggestedReviewingEditor") {
    ...EditorDetails
    __typename
  }
  opposedReviewingEditors: assignees(role: "opposedReviewingEditor") {
    ...EditorDetails
    __typename
  }
  opposedReviewingEditorsReason
  suggestedReviewers: assignees(role: "suggestedReviewer") {
    ...ReviewerDetails
    __typename
  }
  opposedReviewers: assignees(role: "opposedReviewer") {
    ...ReviewerDetails
    __typename
  }
  opposedReviewersReason
  files {
    downloadLink
    filename
    type
    status
    id
    __typename
  }
  coverLetter
  author {
    firstName
    lastName
    email
    aff
    __typename
  }
  previouslyDiscussed
  previouslySubmitted
  cosubmission
  submitterSignature
  disclosureConsent
  fileStatus
  suggestions {
    fieldName
    suggestions {
      value
      score
      updated
      method
      __typename
    }
    __typename
  }
  __typename
}

fragment EditorDetails on EditorAlias {
  id
  name
  aff
  focuses
  expertises
  __typename
}

fragment ReviewerDetails on ReviewerAlias {
  name
  email
  __typename
}

  `;

  return (await withAuthorization(ctx, query, data ));
};

/**
 * Returns a list of editors for a manuscript
 */
const editors = async (_ctx: ApiTestContext): Promise<Array<EditorAlias>> => {
  throw new NotImplementedError();
};

/**
 * Updates or creates a manuscript
 */
const updateSubmission = async (ctx: ApiTestContext, data: MutationUpdateSubmissionArgs ): Promise<{updateSubmission: Manuscript}> => {
  const query = `
mutation UpdateSubmission($data: ManuscriptInput!) {
  updateSubmission(data: $data) {
    ...WholeManuscript
    __typename
  }
}
fragment WholeManuscript on Manuscript {
  id
  clientStatus
  meta {
    title
    articleType
    subjects
    __typename
  }
  lastStepVisited
  suggestedSeniorEditors: assignees(role: "suggestedSeniorEditor") {
    ...EditorDetails
    __typename
  }
  opposedSeniorEditors: assignees(role: "opposedSeniorEditor") {
    ...EditorDetails
    __typename
  }
  opposedSeniorEditorsReason
  suggestedReviewingEditors: assignees(role: "suggestedReviewingEditor") {
    ...EditorDetails
    __typename
  }
  opposedReviewingEditors: assignees(role: "opposedReviewingEditor") {
    ...EditorDetails
    __typename
  }
  opposedReviewingEditorsReason
  suggestedReviewers: assignees(role: "suggestedReviewer") {
    ...ReviewerDetails
    __typename
  }
  opposedReviewers: assignees(role: "opposedReviewer") {
    ...ReviewerDetails
    __typename
  }
  opposedReviewersReason
  files {
    downloadLink
    filename
    type
    status
    id
    __typename
  }
  coverLetter
  author {
    firstName
    lastName
    email
    aff
    __typename
  }
  previouslyDiscussed
  previouslySubmitted
  cosubmission
  submitterSignature
  disclosureConsent
  fileStatus
  __typename
}
fragment EditorDetails on EditorAlias {
  id
  name
  aff
  focuses
  expertises
  __typename
}
fragment ReviewerDetails on ReviewerAlias {
  name
  email
  __typename
}
  `;

  return await withAuthorization(ctx, query, data );
};

/**
 * Submits a manuscript and triggers an export - would expect status of dashboard.manuscripts to change
 */
const submitManuscript = async (_ctx: ApiTestContext): Promise<Manuscript> => {
  throw new NotImplementedError();
};

/**
 * Uploads a manuscript file, when complete modifies a property on Manuscript
 */
const uploadManuscript = async (_ctx: ApiTestContext): Promise<Manuscript> => {
  throw new NotImplementedError();
};

/**
 * See [[uploadManuscript]]
 */
const uploadSupportingFile = async (_ctx: ApiTestContext): Promise<Manuscript> => {
  throw new NotImplementedError();
};

/**
 * removes uploaded files, modifys a proerty on [[Manuscript]]
 */
const removeUploadedManuscript = async (_ctx: ApiTestContext): Promise<Manuscript> => {
  throw new NotImplementedError();
};

/**
 * See [[removeUploadedManuscript]]
 */
const removeSupportingFiles = async (_ctx: ApiTestContext): Promise<Manuscript> => {
  throw new NotImplementedError();
};

/**
 * Some weird subscription thing - might be weird to test
 */
const fileUploadProgress = async (_ctx: ApiTestContext): Promise<Manuscript> => {
  throw new NotImplementedError();
};

const resolvers = {
  Query: { manuscript, editors, getSubmission},
  Mutation: {
    updateSubmission,
    submitManuscript,
    uploadManuscript,
    uploadSupportingFile,
    removeUploadedManuscript,
    removeSupportingFiles,
  },
  Subscription: { fileUploadProgress },
};
export default resolvers;
