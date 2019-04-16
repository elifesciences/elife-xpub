import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { ALL_MANUSCRIPTS } from './queries'
import { CREATE_MANUSCRIPT, DELETE_MANUSCRIPT } from './mutations'

export default compose(
  graphql(ALL_MANUSCRIPTS),
  graphql(CREATE_MANUSCRIPT, {
    name: 'createManuscript',
    options: {
      refetchQueries: [{ query: ALL_MANUSCRIPTS }],
    },
  }),
  graphql(DELETE_MANUSCRIPT, {
    name: 'deleteManuscript',
    options: {
      refetchQueries: [{ query: ALL_MANUSCRIPTS }],
    },
  }),
)
