import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { AuthenticatedComponent, Layout } from './components/global'
import ErrorBoundary from './components/global/ErrorBoundary'

import LoginPage from './components/pages/Login'
import LogoutPage from './components/pages/Logout/index'
import DashboardPage from './components/pages/Dashboard'
import AuthorGuide from './components/pages/StaticPages/AuthorGuide'
import ReviewerGuide from './components/pages/StaticPages/ReviewerGuide'
import ContactUs from './components/pages/StaticPages/ContactUs'

import SubmissionWizard from './components/pages/SubmissionWizard'
import ErrorPage from './components/pages/Error'
import ThankYouPage from './components/pages/ThankYou'

const Routes = () => (
  <Layout>
    <ErrorBoundary>
      <Switch>
        <Route component={LoginPage} exact path="/login" />
        <Route component={LogoutPage} exact path="/logout" />
        <Route component={AuthorGuide} path="/author-guide" />
        <Route component={ReviewerGuide} path="/reviewer-guide" />
        <Route component={ContactUs} path="/contact-us" />
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
