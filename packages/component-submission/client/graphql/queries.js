import gql from 'graphql-tag'

import { manuscriptFragment } from './fragments'

export const GET_MANUSCRIPT = gql`
  query GetManuscript($id: ID!) {
    manuscript(id: $id) {
      ...WholeManuscript
    }
  }
  ${manuscriptFragment}
`

export const GET_MANUSCRIPT_TITLE = gql`
  query GetManuscript($id: ID!) {
    manuscript(id: $id) {
      meta {
        title
      }
    }
  }
`

export const EDITOR_LIST_QUERY = gql`
  query EditorList($role: String!) {
    editors(role: $role) {
      id
      name
      aff
      focuses
      expertises
    }
  }
`
