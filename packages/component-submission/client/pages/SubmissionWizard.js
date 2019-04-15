import React from 'react'
import { Switch, Redirect } from 'react-router-dom'
import {
  compose,
  withHandlers,
  withProps,
  branch,
  renderComponent,
} from 'recompose'
import {
  ErrorPage,
  TrackedRoute,
} from '@elifesciences/component-elife-app/client'
import { Loading } from '@elifesciences/component-elife-ui/client/atoms'

import AuthorPageContainer from '../components/steps/Author'
import FilesPageContainer from '../components/steps/Files'
import SubmissionPage from '../components/steps/Submission'
import EditorsPageContainer from '../components/steps/Editors'
import DisclosurePage from '../components/steps/Disclosure'
import authorPageSchema from '../components/steps/Author/schema'
import filesPageSchema from '../components/steps/Files/schema'
import submissionPageSchema from '../components/steps/Submission/schema'
import editorsPageSchema from '../components/steps/Editors/schema'
import disclosurePageSchema from '../components/steps/Disclosure/schema'
import WizardStep from '../components/WizardStep'

import withGQL from '../graphql/withGQL'
import { parseFormToOutputData, parseInputToFormData } from '../utils'

const SubmissionWizard = ({
  match,
  history,
  updateManuscript,
  submitManuscript,
  initialValues,
  uploadProgress,
  uploadManuscriptFile,
  deleteManuscriptFile,
}) => (
  <Switch>
    <TrackedRoute
      exact
      path={`${match.path}/files`}
      render={() => (
        <WizardStep
          component={FilesPageContainer}
          deleteManuscriptFile={deleteManuscriptFile}
          handleAutoSave={updateManuscript}
          handleButtonClick={updateManuscript}
          history={history}
          initialValues={initialValues}
          manuscriptUploadProgress={uploadProgress.manuscriptUploadProgress}
          previousUrl={`${match.url}/author`}
          step={1}
          title="Write your cover letter and upload your manuscript"
          validationSchema={filesPageSchema}
          uploadManuscriptFile={uploadManuscriptFile}
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
)

export default compose(
  withGQL,
  // TODO: This error / loading branch wrapper is a common thing across app. Should be turned into an import
  branch(
    props => props.data && (props.data.loading && !props.data.manuscripts),
    renderComponent(Loading),
  ),
  branch(props => !props.data || props.data.error, renderComponent(ErrorPage)),
  withProps(props => ({
    initialValues: parseInputToFormData(props.data.manuscript),
  })),
  withHandlers({
    updateManuscript: props => formValues =>
      props.updateManuscript({
        variables: { data: parseFormToOutputData(formValues) },
      }),
    submitManuscript: props => formValues =>
      props.submitManuscript({
        variables: { data: parseFormToOutputData(formValues) },
      }),
  }),
)(SubmissionWizard)
