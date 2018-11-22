import gql from 'graphql-tag'

export const ALL_MANUSCRIPTS = gql`
  query DashboardManuscripts {
    manuscripts {
      id
      created
      meta {
        title
      }
      clientStatus
      formState
    }
  }
`
