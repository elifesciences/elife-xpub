import React from 'react'
import { hot } from 'react-hot-loader/root'
import createHistory from 'history/createBrowserHistory'
import { withClientState } from 'apollo-link-state'

import { configureStore, Root } from 'pubsweet-client'

import theme, { GlobalStyles } from '@elifesciences/elife-theme'

import Routes from './routes'
import * as AuthorDetailsSchema from './components/pages/SubmissionWizard/steps/Author/schema'

const history = createHistory()
const store = configureStore(history, {})

const makeApolloConfig = ({ cache, link, ...config }) => {
  const clientStateLink = withClientState({
    cache,
    ...AuthorDetailsSchema.clientStateConfig,
  })

  return {
    cache,
    link: clientStateLink.concat(link),
    ...config,
  }
}

const App = () => (
  <React.Fragment>
    <GlobalStyles/>
    <Root
      history={history}
      makeApolloConfig={makeApolloConfig}
      routes={<Routes />}
      store={store}
      theme={theme}
    />
  </React.Fragment>
)

export default hot(App)
