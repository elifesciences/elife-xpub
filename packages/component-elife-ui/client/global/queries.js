import gql from 'graphql-tag'

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
