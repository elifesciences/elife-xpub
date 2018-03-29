import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { AuthenticatedComponent } from 'pubsweet-client'

import { App, Dashboard, Submit, Login } from './components'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      <AuthenticatedComponent>
        <Component {...props} />
      </AuthenticatedComponent>
    )}
  />
)

const Routes = () => (
  <App>
    <Switch>
      <Route component={Login} exact path="/login" />
      <PrivateRoute component={Submit} exact path="/submit" />
      <PrivateRoute component={Dashboard} path="/" />
    </Switch>
  </App>
)

export default Routes
