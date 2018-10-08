import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { AuthenticatedComponent, Layout } from './components/global'
import LoginPage from './components/pages/Login'
import SubmissionWizard from './components/pages/SubmissionWizard'
import DashboardPage from './components/pages/Dashboard'

const Routes = () => (
  <Switch>
    <Layout>
      <Route component={LoginPage} path="/login" />
      <AuthenticatedComponent>
        <Switch>
          <Route component={SubmissionWizard} path="/submit/:id" />
          <Route component={DashboardPage} />
        </Switch>
      </AuthenticatedComponent>
    </Layout>
  </Switch>
)

export default Routes
