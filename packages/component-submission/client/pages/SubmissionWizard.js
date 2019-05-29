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

import WizardStep from '../components/WizardStep'

import AuthorStepPage from './AuthorStepPage'
import DisclosureStepPage from './DisclosureStepPage'
import FilesStepPage from './FilesStepPage'
import EditorsStepPage from './EditorsStepPage'
import SubmissionPage from './SubmissionPage'

import wizardSchema, {
  authorSchema,
  filesSchema,
  submissionSchema,
  editorsSchema,
} from '../utils/ValidationSchemas'

import wizardWithGQL from '../graphql/wizardWithGQL'

import { parseFormToOutputData, parseInputToFormData } from '../utils'

class SubmissionWizard extends React.Component {
  constructor(props) {
    super(props)
    this.state = { savingRequests: [] }
  }

  enqueueManuscriptUpdate = (values, cb = null) => {
    this.setState(state => {
      const newSavingRequests = state.savingRequests.concat({ values, cb })

      return { savingRequests: newSavingRequests }
    })

    this.runQueue()
  }

  runQueue = () => {
    if (this.state.savingRequests.length === 0) {
      return
    }

    const currentSavingRequests = this.state.savingRequests
    const { values, cb } = currentSavingRequests.shift()

    this.setState({ savingRequests: currentSavingRequests })

    this.props.updateManuscript(values).then(() => {
      if (cb) {
        cb()
      }

      this.runQueue()
    })
  }

  render() {
    const { match, history, submitManuscript, initialValues } = this.props

    return (
      <Switch>
        <TrackedRoute
          exact
          path={`${match.path}/files`}
          render={() => (
            <WizardStep
              component={FilesStepPage}
              handleAutoSave={this.enqueueManuscriptUpdate}
              handleButtonClick={this.enqueueManuscriptUpdate}
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.url}/details`}
              previousUrl={`${match.url}/author`}
              step={1}
              validationSchema={filesSchema}
            />
          )}
        />
        <TrackedRoute
          path={`${match.path}/details`}
          render={() => (
            <WizardStep
              component={SubmissionPage}
              handleAutoSave={this.enqueueManuscriptUpdate}
              handleButtonClick={this.enqueueManuscriptUpdate}
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.url}/editors`}
              previousUrl={`${match.url}/files`}
              step={2}
              title="Help us get your work seen by the right people"
              validationSchema={submissionSchema}
            />
          )}
        />
        <TrackedRoute
          path={`${match.path}/editors`}
          render={() => (
            <WizardStep
              component={EditorsStepPage}
              handleAutoSave={this.enqueueManuscriptUpdate}
              handleButtonClick={this.enqueueManuscriptUpdate}
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.url}/disclosure`}
              previousUrl={`${match.url}/details`}
              step={3}
              title="Who should review your work?"
              validationSchema={editorsSchema}
            />
          )}
        />
        <TrackedRoute
          path={`${match.path}/disclosure`}
          render={() => (
            <WizardStep
              component={DisclosureStepPage}
              finalStep
              handleAutoSave={this.enqueueManuscriptUpdate}
              handleButtonClick={submitManuscript}
              history={history}
              initialValues={initialValues}
              nextUrl={`/thankyou/${match.params.id}`}
              previousUrl={`${match.url}/editors`}
              step={4}
              title="Disclosure of data to editors"
              validationSchema={wizardSchema}
            />
          )}
        />
        <TrackedRoute
          path={`${match.path}/author`}
          render={() => (
            <WizardStep
              component={AuthorStepPage}
              handleAutoSave={this.enqueueManuscriptUpdate}
              handleButtonClick={this.enqueueManuscriptUpdate}
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.url}/files`}
              step={0}
              title="Your details"
              validationSchema={authorSchema}
            />
          )}
        />
        <Redirect from="/submit/:id" to={`/submit/${match.params.id}/author`} />
        <ErrorPage error="404: page not found" />
      </Switch>
    )
  }
}

export default compose(
  wizardWithGQL,
  // TODO: This error / loading branch wrapper is a common thing across app. Should be turned into an import
  branch(
    props => props.data && (props.data.loading && !props.data.manuscripts),
    renderComponent(Loading),
  ),
  branch(props => !props.data || props.data.error, renderComponent(ErrorPage)),
  branch(
    props => props.data.manuscript.clientStatus !== 'CONTINUE_SUBMISSION',
    () => () => <Redirect to="/" />,
  ),
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
