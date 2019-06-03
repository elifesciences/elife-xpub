import React, { useState, useEffect } from 'react'
import { compose, withProps, branch, renderComponent } from 'recompose'
import { Switch, Redirect } from 'react-router-dom'
import { Box, Flex } from '@rebass/grid'
import styled from 'styled-components'
import { Formik } from 'formik'
import {
  ErrorPage,
  TrackedRoute,
} from '@elifesciences/component-elife-app/client'
import { Loading } from '@elifesciences/component-elife-ui/client/atoms'

import AuthorStep from './AuthorStepPage'
import ProgressBar from '../components/ProgressBar'
import wizardWithGQL from '../graphql/wizardWithGQL'
import { parseInputToFormData } from '../utils'
import { STEP_NAMES } from '../utils/constants'

const BoxNoMinWidth = styled(Box)`
  min-width: 0;
`

const NewSubmissionWizard = ({ initialValues, match, history }) => {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const newStep = Object.keys(STEP_NAMES)
      .map(step => STEP_NAMES[step].toLowerCase())
      .indexOf(history.location.pathname.split('/')[3])
    if (newStep !== currentStep) {
      setCurrentStep(newStep)
    }
  })

  return (
    <Formik
      initialValues={initialValues}
      render={formikProps => (
        <Flex>
          <BoxNoMinWidth flex="1 1 100%" mx={[0, 0, 0, '16.666%']}>
            <Box my={5}>
              <ProgressBar currentStep={currentStep} />
            </Box>
            <Switch>
              <TrackedRoute
                formikProps={formikProps}
                path={`${match.path}/author`}
                render={() => <AuthorStep {...formikProps} />}
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
          </BoxNoMinWidth>
        </Flex>
      )}
    />
  )
}

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
