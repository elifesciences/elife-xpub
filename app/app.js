import React from 'react'
import { hot } from 'react-hot-loader'
import createHistory from 'history/createBrowserHistory'
import { withClientState } from 'apollo-link-state'

import { configureStore, Root } from 'pubsweet-client'

import theme from '@pubsweet/elife-theme'

import Routes from './routes'
import * as AuthorDetailsSchema from './components/submission/AuthorDetails/AuthorDetailsSchema'

const pixelGridUnit = parseInt(theme.gridUnit, 10)
theme.space = [
  0,
  pixelGridUnit / 4,
  pixelGridUnit / 2,
  pixelGridUnit,
  pixelGridUnit * 2,
  pixelGridUnit * 4,
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

export default hot(module)(() => (
  <Root
    history={history}
    makeApolloConfig={makeApolloConfig}
    routes={<Routes />}
    store={store}
    theme={theme}
  />
))
