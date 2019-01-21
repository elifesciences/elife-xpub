import React from 'react'
import { hot } from 'react-hot-loader/root'
import createHistory from 'history/createBrowserHistory'
import { withClientState } from 'apollo-link-state'
import ReactGA from 'react-ga'
import config from 'config'
import { hotjar } from 'react-hotjar'

import { configureStore, Root } from 'pubsweet-client'

import theme, { GlobalStyle } from '@elifesciences/elife-theme'

import Routes from './routes'
import * as AuthorDetailsSchema from './components/pages/SubmissionWizard/steps/Author/schema'

const history = createHistory()
const store = configureStore(history, {})

const initializeReactGA = googleAnalyticsId => {
  ReactGA.initialize(googleAnalyticsId)
  ReactGA.pageview('/')
}

initializeReactGA(config.googleAnalytics.id)
hotjar.initialize(config.hotJar.id, config.hotJar.snippetVersion)


const makeApolloConfig = ({ cache, link }) => {
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
    <GlobalStyle />
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
