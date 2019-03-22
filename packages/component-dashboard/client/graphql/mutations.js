import gql from 'graphql-tag'
// TODO: component-dashboard needs its own model or a shared gql fragment for manuscript
import { manuscriptFragment } from '../../../../packages/component-submission/client/operations'

export const CREATE_MANUSCRIPT = gql`
  mutation CreateManuscript {
    createManuscript {
      ...WholeManuscript
    }
  }
  ${manuscriptFragment}
`

export const DELETE_MANUSCRIPT = gql`
  mutation DeleteManuscript($id: ID!) {
    deleteManuscript(id: $id)
  }
`
