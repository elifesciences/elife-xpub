import React from 'react'
import { Switch, Redirect } from 'react-router-dom'
import { Subscription } from 'react-apollo'
import { ErrorPage } from '@elifesciences/component-elife-app/client'

import SubmissionOperations from '../../components/SubmissionOperations'
import AuthorPageContainer from '../../components/steps/Author'
import FilesPageContainer from '../../components/steps/Files'
import SubmissionPage from '../../components/steps/Submission'
import EditorsPageContainer from '../../components/steps/Editors'
import DisclosurePage from '../../components/steps/Disclosure'
import { schema as authorPageSchema } from '../../components/steps/Author/schema'
import { schema as filesPageSchema } from '../../components/steps/Files/schema'
import { schema as submissionPageSchema } from '../../components/steps/Submission/schema'
import { schema as editorsPageSchema } from '../../components/steps/Editors/schema'
import { schema as disclosurePageSchema } from '../../components/steps/Disclosure/schema'
import WizardStep from '../../components/WizardStep'
import { ON_UPLOAD_PROGRESS } from '../../components/operations'
import TrackedRoute from '../../../../../app/client/trackedRoute'

const SubmissionWizard = ({ match, history }) => (
  <SubmissionOperations manuscriptId={match.params.id}>
    {({ initialValues, updateManuscript, submitManuscript }) => (
      <Subscription
        subscription={ON_UPLOAD_PROGRESS}
        variables={{ id: match.params.id }}
      >
        {({ data: uploadData, loading: uploadLoading }) => (
          <Switch>
            <TrackedRoute
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
                  previousUrl={`${match.url}/author`}
                  step={1}
                  title="Write your cover letter and upload your manuscript"
                  uploadData={uploadData}
                  uploadLoading={uploadLoading}
                  validationSchema={filesPageSchema}
                />
              )}
            />
            <TrackedRoute
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
            <TrackedRoute
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
            <TrackedRoute
              path={`${match.path}/disclosure`}
              render={() => (
                <WizardStep
                  component={DisclosurePage}
                  finalStep
                  handleAutoSave={updateManuscript}
                  handleButtonClick={submitManuscript}
                  history={history}
                  initialValues={initialValues}
                  nextUrl={`/thankyou/${match.params.id}`}
                  previousUrl={`${match.url}/editors`}
                  step={4}
                  title="Disclosure of data to editors"
                  validationSchema={disclosurePageSchema}
                />
              )}
            />
            <TrackedRoute
              path={`${match.path}/author`}
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
            <Redirect
              exact
              from="/submit/:id"
              to={`/submit/${match.params.id}/author`}
            />
            <ErrorPage error="404: page not found" />
          </Switch>
        )}
      </Subscription>
    )}
  </SubmissionOperations>
)

export default SubmissionWizard
