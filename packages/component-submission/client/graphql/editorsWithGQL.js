import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import { EDITOR_LIST_QUERY } from './queries'

import graphqlMemoWrapper from './graphqlMemoWrapper'

export default compose(
  graphql(EDITOR_LIST_QUERY, {
    name: 'reviewingEditors',
    options: () => ({ variables: { role: 'reviewing-editor' } }),
  }),
  graphql(EDITOR_LIST_QUERY, {
    name: 'seniorEditors',
    options: () => ({ variables: { role: 'senior-editor,leadership' } }),
  }),
  graphqlMemoWrapper,
)
