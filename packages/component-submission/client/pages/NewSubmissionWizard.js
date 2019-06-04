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
import AuthorStep, { fields as authorFields } from './AuthorStepPage'
import FilesStep, { fileds as filesFields } from './FilesStepPage'
import ProgressBar from '../components/ProgressBar'
import wizardWithGQL from '../graphql/wizardWithGQL'
import { parseInputToFormData } from '../utils'
import { STEP_NAMES } from '../utils/constants'
import wizardSchema, {
  authorSchema,
  filesSchema,
  submissionSchema,
  editorsSchema,
} from '../utils/ValidationSchemas'

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

  const stepConfigurations = [
    { schema: authorSchema, fields: authorFields },
    { schema: filesSchema, fields: filesFields },
    { schema: submissionSchema },
    { schema: editorsSchema },
    { schema: wizardSchema },
  ]

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
                  path={`${match.path}/author`}
                  render={() => <AuthorStep {...formikProps} />}
                />
                <TrackedRoute
                  path={`${match.path}/files`}
                  render={() => <FilesStep {...formikProps} />}
                />
                <TrackedRoute
                  path={`${match.path}/details`}
                  render={() => <div>details step</div>}
                />
                <TrackedRoute
                  path={`${match.path}/editors`}
                  render={() => <div>editors step</div>}
                />
                <TrackedRoute
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
                      stepConfigurations[currentStep].fields.forEach(field =>
                        formikProps.setFieldTouched(field, true),
                      )
                      if (!Object.keys(formikProps.errors).length) {
                        history.push(
                          `${match.url}/${STEP_NAMES[currentStep + 1]}`,
                        )
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
      validationSchema={yup
        .object()
        .shape(stepConfigurations[currentStep].schema)}
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
