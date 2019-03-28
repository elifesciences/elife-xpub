import gql from 'graphql-tag'

// TODO should something like this be in the component-model-user package?
export const CURRENT_USER = gql`
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
`
