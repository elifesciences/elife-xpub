import React from 'react'
import { Route, Switch } from 'react-router-dom'

import {
  AppBar,
  AuthenticatedComponent,
  Dashboard,
  LoginPage,
} from './components'
import SubmissionPage from './components/submission/SubmissionPage'

const Routes = () => (
  <Switch>
    <Route component={LoginPage} path="/login" />
    <AuthenticatedComponent>
      <AppBar />
      <Switch>
        <Route component={SubmissionPage} path="/submit" />
        <Route component={Dashboard} />
      </Switch>
    </AuthenticatedComponent>
  </Switch>
)

export default Routes
