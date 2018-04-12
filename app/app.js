import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import createHistory from 'history/createBrowserHistory'
import { withClientState } from 'apollo-link-state'

import { configureStore, Root } from 'pubsweet-client'

import theme from '@pubsweet/elife-theme'

import Routes from './routes'
import * as AuthorDetailsSchema from './components/submission/AuthorDetailsSchema'

theme.space = [
  0,
  theme.gridUnit / 4,
  theme.gridUnit / 2,
  theme.gridUnit,
  theme.gridUnit * 2,
  theme.gridUnit * 4,
]

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

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <Root
        history={history}
        makeApolloConfig={makeApolloConfig}
        routes={<Routes />}
        store={store}
        theme={theme}
      />
    </AppContainer>,
    document.getElementById('root'),
  )
}

render()

if (module.hot) {
  module.hot.accept('./routes', () => {
    render()
  })
}
