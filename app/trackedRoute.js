import React from 'react'
import { Route } from 'react-router-dom'
import ReactGA from 'react-ga'
import config from 'config'

export default class TrackedRoute extends React.Component {
  trackPage(page) {
    document.title = config.titles[page.split('/')[1]] || 'eLife'
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
