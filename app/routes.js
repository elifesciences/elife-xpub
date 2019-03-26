import React from 'react'
import { Route, Switch } from 'react-router-dom'

// Components
import { DashboardPage } from '@elifesciences/component-dashboard/client'
import { LoginPage } from '@elifesciences/component-login/client'

import { AuthenticatedComponent, Layout } from 'global'
import ErrorBoundary from 'global/ErrorBoundary'
import CookieNotice from 'global/CookieNotice'

import LandingRedirect from './components/pages/LandingRedirect'
import LogoutPage from './components/pages/Logout/index'
import AuthorGuide from '../packages/component-static-pages/client/pages/AuthorGuide'
import ReviewerGuide from '../packages/component-static-pages/client/pages/ReviewerGuide'
import ContactUs from '../packages/component-static-pages/client/pages/ContactUs'

import SubmissionWizard from '../packages/component-submission/client'
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
