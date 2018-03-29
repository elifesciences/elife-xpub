import React from 'react'
import { Link } from 'react-router-dom'

import { AppBar } from '@pubsweet/ui'

const App = ({ children }) => (
  <div>
    <AppBar
      brand="eLife"
      navLinkComponents={[<Link to="/">Dashboard</Link>]}
      onLogoutClick={() => {
        /* empty function for now */
      }}
      user={{ username: 'Dummy User', admin: true }}
    />
    <div>{children}</div>
  </div>
)

export default App
