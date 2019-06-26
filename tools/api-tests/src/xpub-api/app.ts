
import { ApiTestContext } from "./index";
import { GraphQLClient } from "graphql-request";

/**
 * Returns the manuscripts for the logged in user
 * 
 */
const exchangeJournalToken = async (ctx: ApiTestContext): Promise<{}> => {
  const query = `
mutation ($token: String) {
  exchangeJournalToken(token: $token)
}
  `;
  
  const {token} = ctx.state.user;

  const gqlClient = new GraphQLClient(ctx.state.connection.graphql_url, {
    headers: { Authorization: ctx.state.connection.authorization.getOrElse("") },
  });

  return await gqlClient.request(query, {token});
};

const resolvers = {
  query: {},
  mutation: {exchangeJournalToken},
  subscriptions: {},
}

export default resolvers;
