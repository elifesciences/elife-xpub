import React from 'react'
import { Route, Switch } from 'react-router-dom'
import WithCurrentSubmission from './WithCurrentSubmission'
import AuthorPageContainer from './steps/Author'
import FilesPageContainer from './steps/Files'
import SubmissionPage from './steps/Submission'
import EditorsPageContainer from './steps/Editors'
import Disclosure from './steps/Disclosure'
import { schema as authorPageSchema } from './steps/Author/schema'
import { schema as filesPageSchema } from './steps/Files/schema'
import { schema as submissionPageSchema } from './steps/Submission/schema'
import { schema as editorsPageSchema } from './steps/Editors/schema'
import { schema as disclosureSchema } from './steps/Disclosure/schema'
import WizardStep from './WizardStep'

const SubmissionWizard = ({ match, history }) => (
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
              component={FilesPageContainer}
              handleSubmit={progressSubmission}
              handleUpdate={updateSubmission}
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.path}/submission`}
              previousUrl={`${match.path}`}
              step={1}
              title="Write your cover letter and upload your manuscript"
              validationSchema={filesPageSchema}
            />
          )}
        />
        <Route
          path={`${match.path}/submission`}
          render={() => (
            <WizardStep
              component={SubmissionPage}
              handleSubmit={progressSubmission}
              handleUpdate={updateSubmission}
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.path}/editors`}
              previousUrl={`${match.path}/files`}
              step={2}
              title="Help us get your work seen by the right people"
              validationSchema={submissionPageSchema}
            />
          )}
        />
        <Route
          path={`${match.path}/editors`}
          render={() => (
            <WizardStep
              component={EditorsPageContainer}
              handleSubmit={progressSubmission}
              handleUpdate={updateSubmission}
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.path}/disclosure`}
              previousUrl={`${match.path}/submission`}
              step={3}
              title="Who should review your work?"
              validationSchema={editorsPageSchema}
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
              component={AuthorPageContainer}
              handleSubmit={progressSubmission}
              handleUpdate={updateSubmission}
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.path}/files`}
              step={0}
              title="Your details"
              validationSchema={authorPageSchema}
            />
          )}
        />
      </Switch>
    )}
  </WithCurrentSubmission>
)

export default SubmissionWizard
