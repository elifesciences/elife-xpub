import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { ALL_MANUSCRIPTS } from '@elifesciences/component-dashboard/client/graphql/queries'
import { getSubmission } from './queries'
import { updateSubmission, SUBMIT_MANUSCRIPT } from './mutations'

export default compose(
  graphql(getSubmission, {
    options: props => ({ variables: { id: props.match.params.id } }),
  }),
  graphql(updateSubmission, {
    name: 'updateSubmission',
    refetchQueries: [{ query: ALL_MANUSCRIPTS }],
  }),
  graphql(SUBMIT_MANUSCRIPT, {
    name: 'submitManuscript',
    refetchQueries: [{ query: ALL_MANUSCRIPTS }],
  }),
)
