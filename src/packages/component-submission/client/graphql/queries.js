import gql from 'graphql-tag'

import { manuscriptFragment } from './fragments'

export const getSubmission = gql`
  query getSubmission($id: ID!) {
    manuscript(id: $id) {
      ...WholeManuscript
    }
  }
  ${manuscriptFragment}
`

export const getSubmissionTitle = gql`
  query getSubmissionTitle($id: ID!) {
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
