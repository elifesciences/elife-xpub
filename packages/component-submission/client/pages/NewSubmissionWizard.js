import React from 'react'
import { compose, withProps, branch, renderComponent } from 'recompose'
import { Switch, Redirect } from 'react-router-dom'
import { Formik } from 'formik'
import {
  ErrorPage,
  TrackedRoute,
} from '@elifesciences/component-elife-app/client'
import { Loading } from '@elifesciences/component-elife-ui/client/atoms'

import wizardWithGQL from '../graphql/wizardWithGQL'
import { parseInputToFormData } from '../utils'

const NewSubmissionWizard = ({ initialValues, match }) => (
  <Formik
    initialValues={initialValues}
    render={({ values, setFieldValue }) => (
      <Switch>
        <TrackedRoute
          path={`${match.path}/author`}
          render={() => <div>author step</div>}
        />
        <TrackedRoute
          path={`${match.path}/files`}
          render={() => <div>file step</div>}
        />
      </Switch>
    )}
  />
)

export default compose(
  wizardWithGQL,
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
)(NewSubmissionWizard)
