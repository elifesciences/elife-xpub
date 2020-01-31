/**
 * Not used for now, keeping for reference
 */

import React, { useState } from 'react'
import { compose, branch, renderComponent } from 'recompose'
import { Switch, Redirect } from 'react-router-dom'
import { Box, Flex } from '@rebass/grid'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import { Formik, Form } from 'formik'
import * as yup from 'yup'
import config from 'config'
import {
  ErrorPage,
  TrackedRoute,
} from '@elifesciences/component-elife-app/client'
import { Loading } from '@elifesciences/component-elife-ui/client/atoms'
import { FormH2 } from '@elifesciences/component-elife-ui/client/atoms/FormHeadings'
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
import { STEP_NAMES, STEP_TITLES } from '../utils/constants'

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
  updateSubmission, // injected by reCompose
  submitManuscript, // injected by reCompose
}) => {
  const getCurrentStepFromPath = () =>
    STEP_NAMES.map(step => step.toLowerCase()).indexOf(
      history.location.pathname.split('/')[3].toLowerCase(),
    )

  const [currentStep, setCurrentStep] = useState(getCurrentStepFromPath())
  const [isUploading, setIsUploading] = useState(false)
  const [submissionAttempted, setsubmissionAttempted] = useState(false)
  let updatePromise = Promise.resolve()

  const isLastStep = () => currentStep === STEP_NAMES.length - 1
  const initialValues = parseInputToFormData(data.manuscript)
  const stepValidation = [
    authorSchema,
    filesSchema,
    submissionSchema,
    editorsSchema,
    wizardSchema,
  ]

  // save the promise from the submission update mutation
  // the reason we are not storing using useState is that its asynchronous
  const handleSave = formValues => {
    updatePromise = updateSubmission({
      variables: { data: parseFormToOutputData(formValues) },
    })

    updatePromise
      .then(() => {
        updatePromise = Promise.resolve()
      })
      .catch(() => {
        updatePromise = Promise.resolve()
      })

    return updatePromise
  }

  // only submit once we are finished updating
  // this is for the rare case that the form submit while its performing
  // an auto save
  const handleSubmit = formValues =>
    updatePromise
      .then(() =>
        submitManuscript({
          variables: { data: parseFormToOutputData(formValues) },
        }),
      )
      .then(() =>
        history.push(
          config.features && config.features.demographicSurvey
            ? `/survey/${match.params.id}`
            : `/thankyou/${match.params.id}`,
        ),
      )

  const navigateToStep = step => {
    setCurrentStep(step)

    history.push(`${match.url}/${STEP_NAMES[step].toLowerCase()}`)

    // scroll to top
    window.scrollTo(0, 0)
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      render={formikProps => {
        const touchAllErrorFields = errors => {
          Object.keys(errors).forEach(errorField => {
            if (typeof errors[errorField] === 'object') {
              const flattenedSubfields = flattenObject(errors[errorField])
              Object.keys(flattenedSubfields).forEach(subField => {
                formikProps.setFieldTouched(`${errorField}.${subField}`, true)
              })
            } else {
              formikProps.setFieldTouched(errorField, true, false)
            }
          })
        }
        return (
          <Form data-test-id="submission-wizard-form">
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
                <FormH2>{STEP_TITLES[currentStep]}</FormH2>
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
                    render={() => (
                      <DetailsStep
                        initialTitle={initialValues.meta.title}
                        {...formikProps}
                      />
                    )}
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
                      We&apos;re sorry but there appears to be one or more
                      errors in your submission that require attention before
                      you can submit. Please use the back button to review the{' '}
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
                        navigateToStep(currentStep - 1)
                      }}
                    >
                      Back
                    </Button>
                  </Box>
                  <Box>
                    {currentStep === STEP_NAMES.length - 1 ? (
                      <WizardSubmit
                        setSubmissionAttempted={setsubmissionAttempted}
                        submitForm={formikProps.submitForm}
                        touchAllErrorFields={touchAllErrorFields}
                        validateForm={formikProps.validateForm}
                      />
                    ) : (
                      <Button
                        data-test-id="next"
                        onClick={() => {
                          formikProps.validateForm().then(errors => {
                            if (!Object.keys(errors).length) {
                              const validator = yup
                                .object()
                                .shape(stepValidation[currentStep])
                              // #2401 The validator removes whitespace on emails using trim()
                              const newValues = validator.cast(
                                formikProps.values,
                              )
                              formikProps.setValues(newValues)
                              navigateToStep(currentStep + 1)
                            }
                            touchAllErrorFields(errors)
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
        )
      }}
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
