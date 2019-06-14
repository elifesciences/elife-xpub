import React from 'react'
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

export class SubmissionWizard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentStep: this.getCurrentStepFromPath(),
      isUploading: false,
      submissionAttempted: false,
    }
  }

  getCurrentStepFromPath = () =>
    STEP_NAMES.map(step => step.toLowerCase()).indexOf(
      this.props.history.location.pathname.split('/')[3].toLowerCase(),
    )

  setIsUploading = isUploading => this.setState({ isUploading })

  isLastStep = () => this.state.currentStep === STEP_NAMES.length - 1

  setSubmissionAttempted = submissionAttempted =>
    this.setState({ submissionAttempted })

  setCurrentStep = currentStep => this.setState({ currentStep })

  handleSave = formValues =>
    this.props.updateManuscript({
      variables: { data: parseFormToOutputData(formValues) },
    })

  handleSubmit = formValues =>
    this.props.submitManuscript({
      variables: { data: parseFormToOutputData(formValues) },
    })

  render() {
    const stepValidation = [
      authorSchema,
      filesSchema,
      submissionSchema,
      editorsSchema,
      wizardSchema,
    ]

    const { history, match } = this.props
    const initialValues = parseInputToFormData(this.props.data.manuscript)

    return (
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={this.handleSubmit}
        render={formikProps => (
          <Form data-test-id="submission-wizard-form">
            <SubmissionSave
              disabled={formikProps.isSubmitting}
              handleSave={this.handleSave}
              values={{
                ...formikProps.values,
                lastStepVisited: history.location.pathname,
              }}
            />
            <Flex>
              <BoxNoMinWidth flex="1 1 100%" mx={[0, 0, 0, '16.666%']}>
                <Box my={5}>
                  <ProgressBar currentStep={this.state.currentStep} />
                </Box>
                <FormH2>{STEP_NAMES[this.state.currentStep]}</FormH2>
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
                        isUploading={this.state.isUploading}
                        setIsUploading={this.setIsUploading}
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
                        isSubmissionAttempted={this.state.submissionAttempted}
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
                  this.state.submissionAttempted &&
                  this.isLastStep() && (
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
                      disabled={this.state.currentStep === 0}
                      onClick={() => {
                        this.setCurrentStep(this.state.currentStep - 1)
                        history.push(
                          `${match.url}/${STEP_NAMES[
                            this.state.currentStep - 1
                          ].toLowerCase()}`,
                        )
                      }}
                    >
                      Back
                    </Button>
                  </Box>
                  <Box>
                    {this.state.currentStep === STEP_NAMES.length - 1 ? (
                      <WizardSubmit
                        setSubmissionAttempted={
                          this.state.setsubmissionAttempted
                        }
                        setTouched={formikProps.setTouched}
                        submitForm={formikProps.submitForm}
                        validateForm={formikProps.validateForm}
                      />
                    ) : (
                      <Button
                        data-test-id="next"
                        onClick={() => {
                          formikProps.validateForm().then(errors => {
                            if (!Object.keys(errors).length) {
                              this.setCurrentStep(this.state.currentStep + 1)
                              history.push(
                                `${match.url}/${STEP_NAMES[
                                  this.state.currentStep
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
        validationSchema={yup
          .object()
          .shape(stepValidation[this.state.currentStep])}
      />
    )
  }
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
