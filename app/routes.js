import React from 'react'
import { Route, Switch } from 'react-router-dom'

import {
  AppBar,
  AuthenticatedComponent,
  Dashboard,
  AuthorDetailsPage,
  FileUploadsPage,
  LoginPage,
  ManuscriptMetadataPage,
  ReviewerSuggestionsPage,
} from './components'

const Routes = () => (
  <Switch>
    <Route component={LoginPage} path="/login" />
    <AuthenticatedComponent>
      <AppBar />
      <Switch>
        <Route component={AuthorDetailsPage} exact path="/submit" />
        <Route component={FileUploadsPage} exact path="/submit/upload" />
        <Route
          component={ManuscriptMetadataPage}
          exact
          path="/submit/metadata"
        />
        <Route
          component={ReviewerSuggestionsPage}
          exact
          path="/submit/suggestions"
        />
        <Route component={Dashboard} path="/" />
      </Switch>
    </AuthenticatedComponent>
  </Switch>
)

export default Routes
