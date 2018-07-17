import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { AuthenticatedComponent, Layout } from './components/global'
import LoginPage from './components/pages/login'
import SubmissionPage from './components/pages/submission-wizard'
import ManuscriptPage from './components/pages/manuscript'
import DashboardPage from './components/pages/dashboard'

const Routes = () => (
  <Switch>
    <Route component={LoginPage} path="/login" />
    <AuthenticatedComponent>
      <Layout>
        <Switch>
          <Route component={SubmissionPage} path="/submit" />
          <Route component={ManuscriptPage} path="/manuscript/:id" />
          <Route component={DashboardPage} />
        </Switch>
      </Layout>
    </AuthenticatedComponent>
  </Switch>
)

export default Routes
