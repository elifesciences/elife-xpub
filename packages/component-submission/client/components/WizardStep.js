import React from 'react'
import styled from 'styled-components'
import { Formik } from 'formik'
import * as yup from 'yup'
import { Box, Flex } from '@rebass/grid'
import { Button } from '@pubsweet/ui'
import { ButtonLink } from '@elifesciences/component-elife-ui/client/atoms'
import { FormH2 } from '@elifesciences/component-elife-ui/client/atoms/FormHeadings'
import AutoSave from './AutoSave'
import ProgressBar from './ProgressBar'
import WizardSubmit from './WizardSubmit'
import SavePageStatus from './SavePageStatus'

const BoxNoMinWidth = styled(Box)`
  min-width: 0;
`
class WizardStep extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      submissionAttempted: false,
    }
  }

  setSubmissionAttempted = (value = true) => {
    this.state.submissionAttempted = value
  }

  render() {
    const {
      component: FormComponent,
      finalStep,
      handleAutoSave,
      handleButtonClick,
      history,
      nextUrl,
      previousUrl,
      initialValues,
      title,
      step,
      validationSchema,
      ...wizardProps
    } = this.props
    return (
      <Formik
        initialValues={initialValues}
        // ensure each page gets a new form instance otherwise all fields are touched
        key={title}
        onSubmit={values => {
          handleButtonClick(values).then(() => history.push(nextUrl))
        }}
        render={({
          values,
          handleSubmit,
          isSubmitting,
          setTouched,
          submitForm,
          validateForm,
          ...formProps
        }) => (
          <Flex>
            <BoxNoMinWidth flex="1 1 100%" mx={[0, 0, 0, '16.666%']}>
              <form noValidate onSubmit={handleSubmit}>
                <AutoSave
                  disabled={isSubmitting}
                  onSave={handleAutoSave}
                  values={values}
                />
                <SavePageStatus
                  id={values.id}
                  url={history.location.pathname}
                />
                <Box my={5}>
                  <ProgressBar currentStep={step} />
                </Box>

                {title && <FormH2>{title}</FormH2>}

                <FormComponent
                  values={values}
                  {...formProps}
                  isSubmissionAttempted={this.state.submissionAttempted}
                  {...wizardProps}
                />

                <Flex mt={6}>
                  {previousUrl && (
                    <Box mr={3}>
                      <ButtonLink data-test-id="back" to={previousUrl}>
                        Back
                      </ButtonLink>
                    </Box>
                  )}
                  <Box>
                    {finalStep ? (
                      <WizardSubmit
                        setSubmissionAttempted={this.setSubmissionAttempted}
                        setTouched={setTouched}
                        submitForm={submitForm}
                        validateForm={validateForm}
                      />
                    ) : (
                      <Button data-test-id="next" primary type="submit">
                        Next
                      </Button>
                    )}
                  </Box>
                </Flex>
              </form>
            </BoxNoMinWidth>
          </Flex>
        )}
        validationSchema={yup.object().shape(validationSchema)}
      />
    )
  }
}

export default WizardStep
