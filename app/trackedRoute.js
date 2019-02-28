import React from 'react'
import { Route } from 'react-router-dom'
import ReactGA from 'react-ga'
import config from 'config'

export default class TrackedRoute extends React.Component {
  trackPage(page) {
    this.lastTracked = page
    ReactGA.set({
      page,
    })
    ReactGA.pageview(page)
  }

  render() {
    const { path } = this.props
    document.title = config.titles[path.split('/')[1]] || 'eLife'
    if (path !== this.lastTracked) {
      this.trackPage(path)
    }
    return <Route {...this.props} />
  }
}
