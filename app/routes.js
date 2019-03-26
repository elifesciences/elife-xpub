import React from 'react'
import { Route, Switch } from 'react-router-dom'

// Components
import { DashboardPage } from '@elifesciences/component-dashboard/client'
import { ErrorPage } from '@elifesciences/component-elife-ui/client'
import {
  ContactUs,
  ReviewerGuide,
  AuthorGuide,
} from '@elifesciences/component-static-pages/client'
import {
  ThankYouPage,
  SubmissionWizard,
} from '@elifesciences/component-submission/client'

import { AuthenticatedComponent, Layout } from 'global'
import ErrorBoundary from 'global/ErrorBoundary'
import CookieNotice from 'global/CookieNotice'
import TrackedRoute from './trackedRoute'

import LoginPage from '../packages/component-login/client'
import LandingRedirect from '../packages/component-login/client/pages/LandingRedirect'
import LogoutPage from '../packages/component-login/client/pages/Logout/index'

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
