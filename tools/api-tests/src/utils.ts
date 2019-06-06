import { ApiTestContext } from "./xpub-api";
import { omit } from 'lodash';
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

export const stripTypeNameFromJson = (thing: object):object =>{
  const trimmed = omit(thing, ['__typename']);

  const recursiveTrimmed =Object.entries(trimmed).map(([key, value]) => {
    if(value && typeof value === 'object') {
      return {[key]: stripTypeNameFromJson(value)}
    } else {
      return {[key]: value};
    }
  }).reduce((obj: object, acc: object) => {
    return {
      ...acc,
      ...obj,
    }
  }, {});
  return recursiveTrimmed;
}

