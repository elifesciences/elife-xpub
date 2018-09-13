import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { AuthenticatedComponent, Layout } from './components/global'
import LoginPage from './components/pages/Login'
import SubmissionWizard from './components/pages/SubmissionWizard'
import DashboardPage from './components/pages/Dashboard'

const Routes = () => (
  <Switch>
    <Route component={LoginPage} path="/login" />
    <AuthenticatedComponent>
      <Layout>
        <Switch>
          <Route component={SubmissionWizard} path="/submit" />
          <Route component={DashboardPage} />
        </Switch>
      </Layout>
    </AuthenticatedComponent>
  </Switch>
)

export default Routes
