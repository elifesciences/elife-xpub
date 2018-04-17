import React from 'react'
import { Route, Switch } from 'react-router-dom'
import AuthorDetailsPage from './AuthorDetails/AuthorDetailsPage'
import FileUploadsPage from './FileUploads/FileUploadsPage'
import ManuscriptMetadataPage from './ManuscriptMetadata/ManuscriptMetadataPage'
import ReviewerSuggestionsPage from './ReviewerSuggestions/ReviewerSuggestionsPage'

const SubmissionPage = ({ match }) => (
  <Switch>
    <Route component={FileUploadsPage} path={`${match.path}/upload`} />
    <Route component={ManuscriptMetadataPage} path={`${match.path}/metadata`} />
    <Route
      component={ReviewerSuggestionsPage}
      path={`${match.path}/suggestions`}
    />
    <Route component={AuthorDetailsPage} />
  </Switch>
)

export default SubmissionPage
