import React, { useState } from 'react'
import { compose, branch, renderComponent } from 'recompose'
import { Switch, Redirect } from 'react-router-dom'
import { Box, Flex } from '@rebass/grid'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import { Formik, Form } from 'formik'
import * as yup from 'yup'
import {
  ErrorPage,
  TrackedRoute,
} from '@elifesciences/component-elife-app/client'
import { Loading } from '@elifesciences/component-elife-ui/client/atoms'
import { Button } from '@pubsweet/ui'

import AuthorStep from './AuthorStepPage'
import FilesStep from './FilesStepPage'
import DetailsStep from './DetailsStepPage'
import EditorStep from './EditorsStepPage'
import DisclosureStep from './DisclosureStepPage'

import SubmissionSave from '../components/SubmissionSave'
import WizardSubmit from '../components/WizardSubmit'
import ProgressBar from '../components/ProgressBar'
import wizardWithGQL from '../graphql/wizardWithGQL'
import {
  parseInputToFormData,
  parseFormToOutputData,
  flattenObject,
  getErrorStepsFromErrors,
  convertArrayToReadableList,
} from '../utils'
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

const ErrorMessage = styled.div`
  color: ${th('colorError')};
`

export const SubmissionWizard = ({
  data, // Contains data from an apollo GQL query
  match, // Comes from react router, contains information about the path
  history,
  updateManuscript, // injected by reCompose
  submitManuscript, // injected by reCompose
}) => {
  const getCurrentStepFromPath = () =>
    STEP_NAMES.map(step => step.toLowerCase()).indexOf(
      history.location.pathname.split('/')[3].toLowerCase(),
    )

  const [currentStep, setCurrentStep] = useState(getCurrentStepFromPath())
  const [isUploading, setIsUploading] = useState(false)
  const [submissionAttempted, setsubmissionAttempted] = useState(false)

  const isLastStep = () => currentStep === STEP_NAMES.length - 1
  const initialValues = parseInputToFormData(data.manuscript)
  const stepValidation = [
    authorSchema,
    filesSchema,
    submissionSchema,
    editorsSchema,
    wizardSchema,
  ]

  const handleSave = formValues =>
    updateManuscript({
      variables: { data: parseFormToOutputData(formValues) },
    })

  const handleSubmit = formValues =>
    submitManuscript({
      variables: { data: parseFormToOutputData(formValues) },
    })

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      render={formikProps => (
        <Form data-testid="submission-wizard-form">
          <SubmissionSave
            disabled={formikProps.isSubmitting}
            handleSave={handleSave}
            values={{
              ...formikProps.values,
              lastStepVisited: history.location.pathname,
            }}
          />
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
                  render={() => (
                    <FilesStep
                      {...formikProps}
                      isUploading={isUploading}
                      setIsUploading={setIsUploading}
                    />
                  )}
                />
                <TrackedRoute
                  path={`${match.path}/details`}
                  render={() => <DetailsStep {...formikProps} />}
                />
                <TrackedRoute
                  path={`${match.path}/editors`}
                  render={() => <EditorStep {...formikProps} />}
                />
                <TrackedRoute
                  path={`${match.path}/disclosure`}
                  render={() => (
                    <DisclosureStep
                      isSubmissionAttempted={submissionAttempted}
                      {...formikProps}
                    />
                  )}
                />
                <Redirect
                  from="/submit/:id"
                  to={`/submit/${match.params.id}/author`}
                />
                <ErrorPage error="404: page not found" />
              </Switch>
              {!!Object.keys(formikProps.errors).length &&
                submissionAttempted &&
                isLastStep() && (
                  <ErrorMessage data-test-id="test-error-message">
                    We&apos;re sorry but there appears to be one or more errors
                    in your submission that require attention before you can
                    submit. Please use the back button to review the{' '}
                    {convertArrayToReadableList(
                      getErrorStepsFromErrors(formikProps.errors),
                    )}{' '}
                    steps before trying again.
                  </ErrorMessage>
                )}
              <Flex mt={6}>
                <Box mr={3}>
                  <Button
                    data-test-id="back"
                    disabled={currentStep === 0}
                    onClick={() => {
                      setCurrentStep(currentStep - 1)
                      history.push(
                        `${match.url}/${STEP_NAMES[
                          currentStep - 1
                        ].toLowerCase()}`,
                      )
                    }}
                  >
                    Back
                  </Button>
                </Box>
                <Box>
                  {currentStep === STEP_NAMES.length - 1 ? (
                    <WizardSubmit
                      setSubmissionAttempted={setsubmissionAttempted}
                      setTouched={formikProps.setTouched}
                      submitForm={formikProps.submitForm}
                      validateForm={formikProps.validateForm}
                    />
                  ) : (
                    <Button
                      data-testid="next"
                      onClick={() => {
                        formikProps.validateForm().then(errors => {
                          if (!Object.keys(errors).length) {
                            setCurrentStep(currentStep + 1)
                            history.push(
                              `${match.url}/${STEP_NAMES[
                                currentStep + 1
                              ].toLowerCase()}`,
                            )
                          }

                          Object.keys(errors).forEach(errorField => {
                            if (typeof errors[errorField] === 'object') {
                              const flattenedSubfields = flattenObject(
                                errors[errorField],
                              )
                              Object.keys(flattenedSubfields).forEach(
                                subField => {
                                  formikProps.setFieldTouched(
                                    `${errorField}.${subField}`,
                                    true,
                                  )
                                },
                              )
                            } else {
                              formikProps.setFieldTouched(
                                errorField,
                                true,
                                false,
                              )
                            }
                          })
                        })
                      }}
                      primary
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Flex>
            </BoxNoMinWidth>
          </Flex>
        </Form>
      )}
      validationSchema={yup.object().shape(stepValidation[currentStep])}
    />
  )
}

export default compose(
  wizardWithGQL, // This injects updateManuscript and submitManuscript into the props
  branch(
    props => props.data && (props.data.loading && !props.data.manuscripts),
    renderComponent(Loading),
  ),
  branch(props => !props.data || props.data.error, renderComponent(ErrorPage)),
  branch(
    props => props.data.manuscript.clientStatus !== 'CONTINUE_SUBMISSION',
    () => () => <Redirect to="/" />,
  ),
)(SubmissionWizard)
