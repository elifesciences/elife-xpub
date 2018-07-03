import React from 'react'
import { Route, Switch } from 'react-router-dom'

import {
  AuthenticatedComponent,
  LoginPage,
  CorrespondingAuthorConfirmation,
  CorrespondingAuthorMistake,
} from './components'
import Layout from './components/global/Layout'
import SubmissionPage from './components/submission/SubmissionPage'
import ManuscriptPage from './components/manuscript/ManuscriptPage'
import DashboardPage from './components/dashboard/DashboardPage'

const Routes = () => (
  <Switch>
    <Route component={LoginPage} path="/login" />
    <Route
      component={CorrespondingAuthorConfirmation}
      path="/confirm-author/:id"
    />
    <Route component={CorrespondingAuthorMistake} path="/decline-author/:id" />
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
