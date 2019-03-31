import React from 'react'
import { ErrorPage } from '@elifesciences/component-elife-app/client'

class ErrorBoundary extends React.Component {
  state = {}

  componentDidCatch(error) {
    this.setState({ error })
  }

  render() {
    if (this.state.error) {
      return <ErrorPage error={this.state.error} />
    }

    return this.props.children
  }
}

export default ErrorBoundary
