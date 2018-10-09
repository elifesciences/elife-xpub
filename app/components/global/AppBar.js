import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { graphql, compose } from 'react-apollo'
import { AppBar } from '@pubsweet/ui'
import { CURRENT_USER } from './queries'

const ElifeAppBar = ({ history, data }) => (
  <AppBar
    brand={<img alt="eLife" src="/assets/elife-logo.png" />}
    navLinkComponents={[<Link to="/">Dashboard</Link>]}
    onLogoutClick={() => {
      window.localStorage.removeItem('token')
      history.push('/')
    }}
    user={data.currentUser}
  />
)

export default compose(
  withRouter,
  graphql(CURRENT_USER),
)(ElifeAppBar)
