import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { App, Dashboard, Submission, Login } from './components'

/*
 * TODO: implement login/signup and wrap Component in AuthenticatedComponent:
 * <AuthenticatedComponent>
 *   <Component {...props}>
 * </AuthenticatedComponent>
 */
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => <Component {...props} />} />
)

const Routes = () => (
  <App>
    <Switch>
      <Route component={Login} exact path="/login" />
      <PrivateRoute component={Submission} exact path="/submit" />
      <PrivateRoute component={Dashboard} path="/" />
    </Switch>
  </App>
)

export default Routes
