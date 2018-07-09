import React from 'react'
import { Formik } from 'formik'
import { Box, Flex } from 'grid-styled'
import { Button } from '@pubsweet/ui'
import ButtonLink from '../ui/atoms/ButtonLink'
import { FormH2 } from '../ui/atoms/FormHeadings'
import AutoSave from './AutoSave'
import ProgressBar from './ProgressBar'

const WizardStep = ({
  component: FormComponent,
  handleSubmit,
  handleUpdate,
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
      <form noValidate onSubmit={handleFormSubmit}>
        <AutoSave onSave={handleUpdate} values={values} />

        <ProgressBar currentStep={step} />
        <Box mt={6}>
          <FormH2>{title}</FormH2>
        </Box>
        <FormComponent values={values} {...formProps} />

        <Flex mt={5}>
          {previousUrl && (
            <Box mr={3}>
              <ButtonLink to={previousUrl}>Back</ButtonLink>
            </Box>
          )}
          <Box>
            <Button data-test-id="next" primary type="submit">
              {submitButtonText}
            </Button>
          </Box>
        </Flex>
      </form>
    )}
    validationSchema={validationSchema}
  />
)

export default WizardStep
