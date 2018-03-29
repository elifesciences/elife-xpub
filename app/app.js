import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import createHistory from 'history/createBrowserHistory'

import { configureStore, Root } from 'pubsweet-client'

import theme from '@pubsweet/elife-theme'

import Routes from './routes'

const history = createHistory()
const store = configureStore(history, {})

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <Root history={history} routes={<Routes />} store={store} theme={theme} />
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
