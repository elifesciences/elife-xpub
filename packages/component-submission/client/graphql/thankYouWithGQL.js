import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { getSubmissionTitle } from './queries'

export default compose(
  graphql(getSubmissionTitle, {
    options: props => ({ variables: { id: props.match.params.id } }),
  }),
)
