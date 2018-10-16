import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { AuthenticatedComponent, Layout } from './components/global'
import ErrorPage from './components/pages/Error'
import LoginPage from './components/pages/Login'
import LogoutPage from './components/pages/Logout/index'
import SubmissionWizard from './components/pages/SubmissionWizard'
import DashboardPage from './components/pages/Dashboard'
import AuthorGuide from './components/pages/AuthorGuide'
import ReviewerGuide from './components/pages/ReviewerGuide'
import ContactUs from './components/pages/ContactUs'
import ThankYouPage from './components/pages/ThankYou'

const Routes = () => (
  <Layout>
    <Switch>
      <Route component={LoginPage} exact path="/login" />
      <Route component={LogoutPage} exact path="/logout" />
      <Route component={AuthorGuide} exact path="/author-guide" />
      <Route component={ReviewerGuide} exact path="/reviewer-guide" />
      <Route component={ContactUs} exact path="/contact-us" />
      <AuthenticatedComponent>
        <Switch>
          <Route component={ThankYouPage} path="/thankyou/:id" />
          <Route component={SubmissionWizard} path="/submit/:id" />
          <Route component={DashboardPage} exact path="/" />
          <ErrorPage error="404: page not found" />
        </Switch>
      </AuthenticatedComponent>
    </Switch>
  </Layout>
)

export default Routes
