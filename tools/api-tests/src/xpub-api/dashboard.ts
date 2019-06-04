/**
 * The dashboard api - a definition, actions and functions to call those actions
 * The graphql definitions are located in 'packages/component-dashboard/server/typeDefs.graphqls'
 */

import { ApiTestContext, GqlChunk } from "./index";
import { GraphQLClient } from "graphql-request";
import { Manuscript } from "../generated/graphql";
import { NotImplementedError } from "../utils";

/**
 * Returns the manuscripts for the logged in user
 * return type: [Manuscript]!
 */
const manuscripts = async (ctx: ApiTestContext): Promise<Manuscript[]> => {
  const query = `
query DashboardManuscripts {
  manuscripts {
    id
    created
    updated
    meta {
      title
      __typename
    }
    clientStatus
    lastStepVisited
    __typename
  }
}
  `;

  const gqlClient = new GraphQLClient(ctx.state.connection.graphql_url, {
    headers: { Authorization: ctx.state.connection.authorization.getOrElse("") },
  });

  return await gqlClient.request(query);
};

const createManuscript = async (_ctx: ApiTestContext): Promise<{}> => {
  throw new NotImplementedError();
  return {};
};

const deleteManuscript = async (_ctx: ApiTestContext): Promise<{}> => {
  throw new NotImplementedError();
  return {};
};

/**
 * Returns a thing that'll perform the queries/mutations and return them
 */
const resolvers: GqlChunk = {
  Query: {
    manuscripts,
  },
  Mutation: {
    createManuscript,
    deleteManuscript,
  },
  Subscription: {},
};

export default resolvers;
