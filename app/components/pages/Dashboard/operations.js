import gql from 'graphql-tag'

export const ALL_MANUSCRIPTS = gql`
  query DashboardManuscripts($belongingTo: String) {
    manuscripts(belongingTo: $belongingTo) {
      id
      created
      meta {
        title
      }
      clientStatus
    }
  }
`
