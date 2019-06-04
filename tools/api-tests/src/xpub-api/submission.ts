/**
 * Helpers for component-submission
 */

import { ApiTestContext, GqlChunk } from './index';
import { GraphQLClient} from 'graphql-request';
import { Manuscript, EditorAlias } from '../generated/graphql';
import { NotImplementedError } from '../utils';

const manuscript = async (_ctx: ApiTestContext): Promise<Manuscript> => {
  throw new NotImplementedError();
};

const editors = async (_ctx: ApiTestContext): Promise<Array<EditorAlias>> => {
  throw new NotImplementedError();
};

const submitManuscript = async (_ctx: ApiTestContext): Promise<Manuscript> => {
  throw new NotImplementedError();
};

const uploadManuscript = async (_ctx: ApiTestContext): Promise<Manuscript> => {
  throw new NotImplementedError();
};

const uploadSupportingFile = async (_ctx: ApiTestContext): Promise<Manuscript> => {
  throw new NotImplementedError();
};

const removeUploadedManuscript = async (_ctx: ApiTestContext): Promise<Manuscript> => {
  throw new NotImplementedError();
};

const removeSupportingFiles = async (_ctx: ApiTestContext): Promise<Manuscript> => {
  throw new NotImplementedError();
};
const fileUploadProgress = async (_ctx: ApiTestContext): Promise<Manuscript> => {
  throw new NotImplementedError();
};


const resolvers: GqlChunk = {
  Query: {manuscript, editors},
  Mutation: {submitManuscript, uploadManuscript, uploadSupportingFile, removeUploadedManuscript, removeSupportingFiles},
  Subscription: {fileUploadProgress},
}
export default resolvers;
