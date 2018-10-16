import React from 'react'
import { Route, Switch } from 'react-router-dom'
import SubmissionOperations from './SubmissionOperations'
import AuthorPageContainer from './steps/Author'
import FilesPageContainer from './steps/Files'
import SubmissionPage from './steps/Submission'
import EditorsPageContainer from './steps/Editors'
import DisclosurePage from './steps/Disclosure'
import { schema as authorPageSchema } from './steps/Author/schema'
import { schema as filesPageSchema } from './steps/Files/schema'
import { schema as submissionPageSchema } from './steps/Submission/schema'
import { schema as editorsPageSchema } from './steps/Editors/schema'
import { schema as disclosurePageSchema } from './steps/Disclosure/schema'
import WizardStep from './WizardStep'

const SubmissionWizard = ({ match, history }) => (
  <SubmissionOperations manuscriptId={match.params.id}>
    {({ initialValues, updateManuscript, submitManuscript }) => (
      <Switch>
        <Route
          exact
          path={`${match.path}/files`}
          render={() => (
            <WizardStep
              component={FilesPageContainer}
              handleAutoSave={updateManuscript}
              handleButtonClick={updateManuscript}
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.url}/submission`}
              previousUrl={`${match.url}`}
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
              handleAutoSave={updateManuscript}
              handleButtonClick={updateManuscript}
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.url}/editors`}
              previousUrl={`${match.url}/files`}
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
              handleAutoSave={updateManuscript}
              handleButtonClick={updateManuscript}
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.url}/disclosure`}
              previousUrl={`${match.url}/submission`}
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
              component={DisclosurePage}
              finalStep
              handleAutoSave={updateManuscript}
              handleButtonClick={submitManuscript}
              history={history}
              initialValues={initialValues}
              nextUrl="/"
              previousUrl={`${match.url}/editors`}
              step={4}
              title="Disclosure of data to editors"
              validationSchema={disclosurePageSchema}
            />
          )}
        />
        <Route
          render={() => (
            <WizardStep
              component={AuthorPageContainer}
              handleAutoSave={updateManuscript}
              handleButtonClick={updateManuscript}
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.url}/files`}
              step={0}
              title="Your details"
              validationSchema={authorPageSchema}
            />
          )}
        />
      </Switch>
    )}
  </SubmissionOperations>
)

export default SubmissionWizard
