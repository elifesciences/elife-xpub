import gql from 'graphql-tag'

import { manuscriptFragment } from './fragments'

export const UPDATE_MANUSCRIPT = gql`
  mutation UpdateManuscript($data: ManuscriptInput!) {
    updateManuscript(data: $data) {
      ...WholeManuscript
    }
  }
  ${manuscriptFragment}
`

export const SUBMIT_MANUSCRIPT = gql`
  mutation SubmitManuscript($data: ManuscriptInput!) {
    submitManuscript(data: $data) {
      ...WholeManuscript
    }
  }
  ${manuscriptFragment}
`
