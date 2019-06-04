import React, { useState, useEffect } from 'react'
import { compose, withProps, branch, renderComponent } from 'recompose'
import { Switch, Redirect } from 'react-router-dom'
import { Box, Flex } from '@rebass/grid'
import styled from 'styled-components'
import { Formik, Form } from 'formik'
import * as yup from 'yup'
import {
  ErrorPage,
  TrackedRoute,
} from '@elifesciences/component-elife-app/client'
import {
  Loading,
  ButtonLink,
} from '@elifesciences/component-elife-ui/client/atoms'
import { Button } from '@pubsweet/ui'
import AuthorStep from './AuthorStepPage'
import ProgressBar from '../components/ProgressBar'
import wizardWithGQL from '../graphql/wizardWithGQL'
import { parseInputToFormData } from '../utils'
import { STEP_NAMES } from '../utils/constants'
import wizardSchema from '../utils/ValidationSchemas'

const BoxNoMinWidth = styled(Box)`
  min-width: 0;
`

const NewSubmissionWizard = ({ initialValues, match, history }) => {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const newStep = STEP_NAMES.map(step => step.toLowerCase()).indexOf(
      history.location.pathname.split('/')[3].toLowerCase(),
    )
    if (newStep !== currentStep) {
      setCurrentStep(newStep)
    }
  })

  return (
    <Formik
      initialValues={initialValues}
      render={formikProps => (
        <Form>
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
              <Flex mt={6}>
                <Box mr={3}>
                  <ButtonLink
                    data-test-id="back"
                    disabled={currentStep === 0}
                    to={`${match.url}/${STEP_NAMES[currentStep - 1]}`}
                  >
                    Back
                  </ButtonLink>
                </Box>
                <Box>
                  <Button
                    data-test-id="next"
                    onClick={() => {
                      if (formikProps.isValid) {
                        history.push(
                          `${match.url}/${STEP_NAMES[currentStep + 1]}`,
                        )
                      } else {
                        formikProps.validateForm()
                      }
                    }}
                    primary
                  >
                    Next
                  </Button>
                </Box>
              </Flex>
            </BoxNoMinWidth>
          </Flex>
        </Form>
      )}
      validationSchema={yup.object().shape(wizardSchema)}
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
