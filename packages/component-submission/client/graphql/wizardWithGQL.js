import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { ALL_MANUSCRIPTS } from '@elifesciences/component-dashboard/client/graphql/queries'
import { GET_MANUSCRIPT } from './queries'
import { UPDATE_MANUSCRIPT, SUBMIT_MANUSCRIPT } from './mutations'

export default compose(
  graphql(GET_MANUSCRIPT, {
    options: props => ({ variables: { id: props.match.params.id } }),
  }),
  graphql(UPDATE_MANUSCRIPT, {
    name: 'updateManuscript',
    refetchQueries: [{ query: ALL_MANUSCRIPTS }],
  }),
  graphql(SUBMIT_MANUSCRIPT, {
    name: 'submitManuscript',
    refetchQueries: [{ query: ALL_MANUSCRIPTS }],
  }),
)
