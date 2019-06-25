/**
 * Helpers for component-submission
 */

import { ApiTestContext } from "./index";
// import { GraphQLClient} from 'graphql-request';
import { Manuscript, MutationUpdateManuscriptArgs, EditorAlias } from "../generated/graphql";
import { withAuthorization, NotImplementedError } from "../utils";

/**
 * Gets a manuscript
 */
const manuscript = async (_ctx: ApiTestContext): Promise<Manuscript> => {
  throw new NotImplementedError();
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
const updateManuscript = async (ctx: ApiTestContext, data: MutationUpdateManuscriptArgs ): Promise<{updateManuscript: Manuscript}> => {
  const query = `
mutation UpdateManuscript($data: ManuscriptInput!) {
  updateManuscript(data: $data) {
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
  Query: { manuscript, editors },
  Mutation: {
    updateManuscript,
    submitManuscript,
    uploadManuscript,
    uploadSupportingFile,
    removeUploadedManuscript,
    removeSupportingFiles,
  },
  Subscription: { fileUploadProgress },
};
export default resolvers;
