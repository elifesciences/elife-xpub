import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { graphql, compose } from 'react-apollo'
import { AppBar } from '@pubsweet/ui'
import { withLoader } from 'pubsweet-client'
import { CURRENT_USER } from './queries'

const ElifeAppBar = ({ history, currentUser }) => (
  <AppBar
    brand={<img alt="eLife" src="/assets/elife-logo.png" />}
    navLinkComponents={[<Link to="/">Dashboard</Link>]}
    onLogoutClick={() => {
      window.localStorage.removeItem('token')
      history.push('/')
    }}
    user={currentUser}
  />
)

export default compose(withRouter, graphql(CURRENT_USER), withLoader())(
  ElifeAppBar,
)
