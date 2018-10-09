import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { AuthenticatedComponent, Layout } from './components/global'
import ErrorPage from './components/pages/Error'
import LoginPage from './components/pages/Login'
import SubmissionWizard from './components/pages/SubmissionWizard'
import DashboardPage from './components/pages/Dashboard'

const Routes = () => (
  <Layout>
    <Switch>
      <Route component={LoginPage} exact path="/login" />
      <AuthenticatedComponent>
        <Switch>
          <Route component={SubmissionWizard} path="/submit/:id" />
          <Route component={DashboardPage} exact path="/" />
          <ErrorPage error="404: page not found" />
        </Switch>
      </AuthenticatedComponent>
    </Switch>
  </Layout>
)

export default Routes
