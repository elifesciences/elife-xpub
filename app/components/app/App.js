import React from 'react'
import { Link, withRouter } from 'react-router-dom'

import { AppBar } from '@pubsweet/ui'

const App = ({ children, history }) => (
  <div>
    <AppBar
      brand="eLife"
      navLinkComponents={[<Link to="/">Dashboard</Link>]}
      onLogoutClick={() => {
        window.localStorage.removeItem('token')
        history.push('/')
      }}
      user={{ username: 'Dummy User', admin: true }}
    />
    <div>{children}</div>
  </div>
)

export default withRouter(App)
