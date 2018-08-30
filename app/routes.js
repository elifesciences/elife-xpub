import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { AuthenticatedComponent, Layout } from './components/global'
import LoginPage from './components/pages/Login'
import SubmissionWizard from './components/pages/SubmissionWizard'
import ManuscriptPage from './components/pages/Manuscript'
import DashboardPage from './components/pages/Dashboard'

const Routes = () => (
  <Switch>
    <Route component={LoginPage} path="/login" />
    <AuthenticatedComponent>
      <Layout>
        <Switch>
          <Route component={SubmissionWizard} path="/submit" />
          <Route component={ManuscriptPage} path="/manuscript/:id" />
          <Route component={DashboardPage} />
        </Switch>
      </Layout>
    </AuthenticatedComponent>
  </Switch>
)

export default Routes
