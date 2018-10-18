import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { AuthenticatedComponent, Layout } from './components/global'
import ErrorBoundary from './components/global/ErrorBoundary'
import ErrorPage from './components/pages/Error'
import LoginPage from './components/pages/Login'
import LogoutPage from './components/pages/Logout/index'
import SubmissionWizard from './components/pages/SubmissionWizard'
import DashboardPage from './components/pages/Dashboard'
import ThankYouPage from './components/pages/ThankYou'

const Routes = () => (
  <Layout>
    <ErrorBoundary>
      <Switch>
        <Route component={LoginPage} exact path="/login" />
        <Route component={LogoutPage} exact path="/logout" />
        <AuthenticatedComponent>
          <Switch>
            <Route component={ThankYouPage} path="/thankyou/:id" />
            <Route component={SubmissionWizard} path="/submit/:id" />
            <Route component={DashboardPage} exact path="/" />
            <ErrorPage error="404: page not found" />
          </Switch>
        </AuthenticatedComponent>
      </Switch>
    </ErrorBoundary>
  </Layout>
)

export default Routes
