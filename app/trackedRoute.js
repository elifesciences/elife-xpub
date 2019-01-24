import React from 'react'
import { Route } from 'react-router-dom'
import ReactGA from 'react-ga'

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
    if (path !== this.lastTracked) {
      this.trackPage(path)
    }
    return <Route {...this.props} />
  }
}
