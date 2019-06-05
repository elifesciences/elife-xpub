/**
 * Helpers for component-submission
 */

import { ApiTestContext, GqlChunk } from "./index";
// import { GraphQLClient} from 'graphql-request';
import { Manuscript, EditorAlias } from "../generated/graphql";
import { withAuthorization, NotImplementedError } from "../utils";

/**
 * Gets a manuscript
 */
const manuscript = async (ctx: ApiTestContext): Promise<Manuscript> => {
  const query = ``;

  return await withAuthorization(ctx, query);
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
const updateManuscript = async (_ctx: ApiTestContext, data: Manuscript): Promise<Manuscript> => {
  console.log(data);
  throw new NotImplementedError();
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

const resolvers: GqlChunk = {
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
