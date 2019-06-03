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
    render={formikProps => (
      <Switch>
        <TrackedRoute
          formikProps={formikProps}
          path={`${match.path}/author`}
          render={() => <div>author step</div>}
        />
        <TrackedRoute
          formikProps={formikProps}
          path={`${match.path}/files`}
          render={() => <div>file step</div>}
        />
        <TrackedRoute
          formikProps={formikProps}
          path={`${match.path}/details`}
          render={() => <div>details step</div>}
        />
        <TrackedRoute
          formikProps={formikProps}
          path={`${match.path}/editors`}
          render={() => <div>editors step</div>}
        />
        <TrackedRoute
          formikProps={formikProps}
          path={`${match.path}/disclosure`}
          render={() => <div>disclosure step</div>}
        />
        <Redirect
          from="/submit/:id"
          to={`/newSubmit/${match.params.id}/author`}
        />
        <ErrorPage error="404: page not found" />
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
