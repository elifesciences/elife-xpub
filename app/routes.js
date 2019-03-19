import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { AuthenticatedComponent, Layout } from './components/global'
import ErrorBoundary from './components/global/ErrorBoundary'
import CookieNotice from './components/global/CookieNotice'

import LandingRedirect from './components/pages/LandingRedirect'
import LoginPage from './components/pages/Login'
import LogoutPage from './components/pages/Logout/index'
import DashboardPage from './components/pages/Dashboard'
import AuthorGuide from './components/pages/StaticPages/AuthorGuide'
import ReviewerGuide from './components/pages/StaticPages/ReviewerGuide'
import ContactUs from './components/pages/StaticPages/ContactUs'

import SubmissionWizard from './components/pages/SubmissionWizard'
import ErrorPage from './components/pages/Error'
import ThankYouPage from './components/pages/ThankYou'
import TrackedRoute from './trackedRoute'

const Routes = () => (
  <React.Fragment>
    <CookieNotice />
    <Switch>
      <TrackedRoute component={LandingRedirect} exact path="/redirect" />
      <Layout>
        <ErrorBoundary>
          <Switch>
            <TrackedRoute component={LoginPage} exact path="/login" />
            <TrackedRoute component={LogoutPage} exact path="/logout" />
            <TrackedRoute component={AuthorGuide} path="/author-guide" />
            <TrackedRoute component={ReviewerGuide} path="/reviewer-guide" />
            <TrackedRoute component={ContactUs} path="/contact-us" />
            <AuthenticatedComponent>
              <Switch>
                <TrackedRoute component={ThankYouPage} path="/thankyou/:id" />
                <Route component={SubmissionWizard} path="/submit/:id" />
                <TrackedRoute component={DashboardPage} exact path="/" />
                <ErrorPage error="404: page not found" />
              </Switch>
            </AuthenticatedComponent>
          </Switch>
        </ErrorBoundary>
      </Layout>
    </Switch>
  </React.Fragment>
)

export default Routes
