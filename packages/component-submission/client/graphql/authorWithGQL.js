import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import { CURRENT_USER } from '@elifesciences/component-elife-app/client/graphql/queries'
import graphqlMemoWrapper from './graphqlMemoWrapper'

export default compose(
  graphql(CURRENT_USER),
  graphqlMemoWrapper,
)
