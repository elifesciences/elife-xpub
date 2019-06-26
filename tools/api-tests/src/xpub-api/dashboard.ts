/**
 * The dashboard api - a definition, actions and functions to call those actions
 * The graphql definitions are located in 'packages/component-dashboard/server/typeDefs.graphqls'
 */

import { ApiTestContext } from "./index";
import { GraphQLClient } from "graphql-request";
import { Manuscript } from "../generated/graphql";
import { withAuthorization, NotImplementedError } from "../utils";

/**
 * Returns the manuscripts for the logged in user
 * return type: [Manuscript]!
 */
const manuscripts = async (ctx: ApiTestContext): Promise<{manuscripts: Manuscript[]}> => {
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

const createManuscript = async (ctx: ApiTestContext): Promise<{createManuscript: Manuscript}> => {
  const query  = `
mutation CreateManuscript {
  createManuscript {
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

  return await withAuthorization(ctx, query);
};

const deleteManuscript = async (_ctx: ApiTestContext): Promise<{}> => {
  throw new NotImplementedError();
  return {};
};

/**
 * Returns a thing that'll perform the queries/mutations and return them
 */
const resolvers = {
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
