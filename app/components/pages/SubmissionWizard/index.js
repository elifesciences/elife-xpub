import React from 'react'
import { Route, Switch } from 'react-router-dom'
import WithCurrentSubmission from './WithCurrentSubmission'
import AuthorDetails from './steps/Author'
import FileUploads from './steps/Files'
import ManuscriptMetadata from './steps/Submission'
import ReviewerSuggestions from './steps/Editors'
import Disclosure from './steps/Disclosure'
import { schema as fileUploadsSchema } from './steps/Files/schema'
import { schema as authorDetailsSchema } from './steps/Author/schema'
import { schema as manuscriptMetadataSchema } from './steps/Submission/schema'
import { schema as reviewerSuggestionsSchema } from './steps/Editors/schema'
import { schema as disclosureSchema } from './steps/Disclosure/schema'
import WizardStep from './WizardStep'

const SubmissionPage = ({ match, history }) => (
  <WithCurrentSubmission>
    {({
      initialValues,
      updateSubmission,
      progressSubmission,
      finishSubmission,
    }) => (
      <Switch>
        <Route
          exact
          path={`${match.path}/upload`}
          render={() => (
            <WizardStep
              component={FileUploads}
              handleSubmit={progressSubmission}
              handleUpdate={updateSubmission}
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.path}/metadata`}
              previousUrl={`${match.path}`}
              step={1}
              title="Write your cover letter and upload your manuscript"
              validationSchema={fileUploadsSchema}
            />
          )}
        />
        <Route
          path={`${match.path}/metadata`}
          render={() => (
            <WizardStep
              component={ManuscriptMetadata}
              handleSubmit={progressSubmission}
              handleUpdate={updateSubmission}
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.path}/suggestions`}
              previousUrl={`${match.path}/upload`}
              step={2}
              title="Help us get your work seen by the right people"
              validationSchema={manuscriptMetadataSchema}
            />
          )}
        />
        <Route
          path={`${match.path}/suggestions`}
          render={() => (
            <WizardStep
              component={ReviewerSuggestions}
              handleSubmit={progressSubmission}
              handleUpdate={updateSubmission}
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.path}/disclosure`}
              previousUrl={`${match.path}/metadata`}
              step={3}
              title="Who should review your work?"
              validationSchema={reviewerSuggestionsSchema}
            />
          )}
        />
        <Route
          path={`${match.path}/disclosure`}
          render={() => (
            <WizardStep
              component={Disclosure}
              handleSubmit={finishSubmission}
              handleUpdate={updateSubmission}
              history={history}
              initialValues={initialValues}
              nextUrl="/dashboard"
              previousUrl={`${match.path}/suggestions`}
              step={4}
              submitButtonText="Submit"
              title="Disclosure of data to editors"
              validationSchema={disclosureSchema}
            />
          )}
        />
        <Route
          render={() => (
            <WizardStep
              component={AuthorDetails}
              handleSubmit={progressSubmission}
              handleUpdate={updateSubmission}
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.path}/upload`}
              step={0}
              title="Who is the corresponding author?"
              validationSchema={authorDetailsSchema}
            />
          )}
        />
      </Switch>
    )}
  </WithCurrentSubmission>
)

export default SubmissionPage
