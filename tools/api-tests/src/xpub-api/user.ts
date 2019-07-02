/**
 * The users api - a definition, actions and functions to call those actions
 * The graphql definitions are located in 'packages/component-dashboard/server/typeDefs.graphqls'
 */

import { ApiTestContext } from "./index";
import { GraphQLClient } from "graphql-request";
import { User } from "../generated/graphql";

/**
 * CurrentUser query - creates or updates the current user based on an auth token.
 *
 * XXX: This shouldn't mutate the state but it does!!!
 */
const currentUser = async (ctx: ApiTestContext): Promise<{currentUser: User}> => {
  const query = `
query CurrentUser {
  currentUser {
    id
    identities {
      ... on ElifeIdentity {
        name
        email
        aff
        meta {
          firstName
          lastName
        }
      }
    }
  }
}
  `;

  const gqlClient = new GraphQLClient(ctx.state.connection.graphql_url, {
    headers: { Authorization: ctx.state.connection.authorization.getOrElse("") },
  });

  return await gqlClient.request(query);
};

const resolvers = {
  Query: {currentUser}
}

export default resolvers;
