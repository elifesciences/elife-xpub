import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { ALL_MANUSCRIPTS } from '@elifesciences/component-dashboard/client/graphql/queries'
import { GET_MANUSCRIPT } from './queries'
import { UPDATE_MANUSCRIPT, SUBMIT_MANUSCRIPT } from './mutations'
import { ON_UPLOAD_PROGRESS } from './subscriptions'

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
  graphql(ON_UPLOAD_PROGRESS, {
    name: 'uploadProgress',
    options: props => ({ variables: { id: props.match.params.id } }),
  }),
)
