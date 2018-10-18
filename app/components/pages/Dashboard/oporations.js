import gql from 'graphql-tag'

export const MANUSCRIPTS = gql`
  query DashboardManuscripts {
    manuscripts {
      id
      created
      meta {
        title
      }
      clientStatus
    }
  }
`

export const DELETE_MANUSCRIPT = gql`
  mutation DeleteManuscript($id: ID!) {
    deleteManuscript(id: $id)
  }
`
