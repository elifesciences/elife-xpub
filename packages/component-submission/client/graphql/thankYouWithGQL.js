import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { GET_MANUSCRIPT_TITLE } from './queries'

export default compose(
  graphql(GET_MANUSCRIPT_TITLE, {
    options: props => ({ variables: { id: props.match.params.id } }),
  }),
)
