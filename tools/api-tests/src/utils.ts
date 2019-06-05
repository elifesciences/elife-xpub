import { ApiTestContext } from "./xpub-api";
import { GraphQLClient } from "graphql-request";

export class NotImplementedError extends Error {
  constructor(message: string = "not implemented") {
    super(message);
    this.name = "NotImplementedError";
  }
}

export async function withAuthorization(config: ApiTestContext, query: string, variables?: any) {
  const gqlClient = new GraphQLClient(config.state.connection.graphql_url, {
    headers: { Authorization: config.state.connection.authorization.getOrElse("") },
  });

  return await gqlClient.request(query, variables);
}
