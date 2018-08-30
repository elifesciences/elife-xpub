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
          path={`${match.path}/files`}
          render={() => (
            <WizardStep
              component={FileUploads}
              handleSubmit={progressSubmission}
              handleUpdate={updateSubmission}
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.path}/submission`}
              previousUrl={`${match.path}`}
              step={1}
              title="Write your cover letter and upload your manuscript"
              validationSchema={fileUploadsSchema}
            />
          )}
        />
        <Route
          path={`${match.path}/submission`}
          render={() => (
            <WizardStep
              component={ManuscriptMetadata}
              handleSubmit={progressSubmission}
              handleUpdate={updateSubmission}
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.path}/editors`}
              previousUrl={`${match.path}/files`}
              step={2}
              title="Help us get your work seen by the right people"
              validationSchema={manuscriptMetadataSchema}
            />
          )}
        />
        <Route
          path={`${match.path}/editors`}
          render={() => (
            <WizardStep
              component={ReviewerSuggestions}
              handleSubmit={progressSubmission}
              handleUpdate={updateSubmission}
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.path}/disclosure`}
              previousUrl={`${match.path}/submission`}
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
              nextUrl="/"
              previousUrl={`${match.path}/editors`}
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
              nextUrl={`${match.path}/files`}
              step={0}
              title="Your details"
              validationSchema={authorDetailsSchema}
            />
          )}
        />
      </Switch>
    )}
  </WithCurrentSubmission>
)

export default SubmissionPage
