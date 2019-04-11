import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import { GET_MANUSCRIPT } from './queries'

export default compose(
  graphql(GET_MANUSCRIPT, {
    options: props => ({ variables: { id: props.match.params.id } }),
  }),
)
