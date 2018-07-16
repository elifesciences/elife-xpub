import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { AuthenticatedComponent, LoginPage } from './components'
import Layout from './components/global/Layout'
import SubmissionPage from './components/pages/submission-wizard/SubmissionPage'
import ManuscriptPage from './components/pages/manuscript/ManuscriptPage'
import DashboardPage from './components/pages/dashboard/DashboardPage'

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
