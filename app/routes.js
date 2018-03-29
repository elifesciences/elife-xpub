import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { AuthenticatedComponent } from 'pubsweet-client'

import {
  ElifeApp,
  ElifeDashboard,
  ElifeSubmit,
  ElifeLogin,
  ElifeSignup,
} from './components'

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
  <ElifeApp>
    <Switch>
      <Route component={ElifeSignup} exact path="/signup" />
      <Route component={ElifeLogin} exact path="/login" />
      <PrivateRoute component={ElifeSubmit} exact path="/submit" />
      <PrivateRoute component={ElifeDashboard} path="/" />
    </Switch>
  </ElifeApp>
)

export default Routes
