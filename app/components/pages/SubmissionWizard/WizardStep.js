import React from 'react'
import { Formik } from 'formik'
import { Box, Flex } from 'grid-styled'
import { Button } from '@pubsweet/ui'
import ButtonLink from '../../ui/atoms/ButtonLink'
import { FormH2 } from '../../ui/atoms/FormHeadings'
import AutoSave from './AutoSave'
import ProgressBar from './ProgressBar'

const WizardStep = ({
  component: FormComponent,
  handleSubmit,
  history,
  nextUrl,
  previousUrl,
  initialValues,
  title,
  step,
  submitButtonText = 'Next',
  validationSchema,
}) => (
  <Formik
    initialValues={initialValues}
    // ensure each page gets a new form instance otherwise all fields are touched
    key={FormComponent.name}
    onSubmit={values => handleSubmit(values).then(() => history.push(nextUrl))}
    render={({ values, handleSubmit: handleFormSubmit, ...formProps }) => (
      <Flex>
        <Box flex="1 1 auto" mx={[0, 0, 0, '16.666%']}>
          <form noValidate onSubmit={handleFormSubmit}>
            <AutoSave onSave={handleSubmit} values={values} />
            <Box my={5}>
              <ProgressBar currentStep={step} />
            </Box>

            <FormH2>{title}</FormH2>

            <FormComponent history={history} values={values} {...formProps} />

            <Flex mt={6}>
              {previousUrl && (
                <Box mr={3}>
                  <ButtonLink data-test-id="back" to={previousUrl}>
                    Back
                  </ButtonLink>
                </Box>
              )}
              <Box>
                <Button data-test-id="next" primary type="submit">
                  {submitButtonText}
                </Button>
              </Box>
            </Flex>
          </form>
        </Box>
      </Flex>
    )}
    validationSchema={validationSchema}
  />
)

export default WizardStep
