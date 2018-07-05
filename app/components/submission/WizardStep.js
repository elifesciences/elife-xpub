import React from 'react'
import { Formik } from 'formik'
import { Box } from 'grid-styled'
import AutoSave from './AutoSave'
import NotificationRibbon from '../ui/atoms/NotificationRibbon'

const EmailVerificationRibbon = ({ values }) => {
  const show = values.manuscriptPersons.some(
    manuscriptPerson =>
      manuscriptPerson.role === 'AUTHOR' &&
      !manuscriptPerson.metadata.confirmed,
  )
  return (
    show && (
      <Box mb={5} mx={-3}>
        <NotificationRibbon data-test-id="author-verification">
          A verification email has been sent to the corresponding author.
        </NotificationRibbon>
      </Box>
    )
  )
}

const WizardStep = ({
  component: FormComponent,
  handleSubmit,
  handleUpdate,
  history,
  nextUrl,
  initialValues,
  validationSchema,
}) => (
  <Formik
    initialValues={initialValues}
    // ensure each page gets a new form instance otherwise all fields are touched
    key={FormComponent.name}
    onSubmit={values => handleSubmit(values).then(() => history.push(nextUrl))}
    render={formProps => (
      <AutoSave onSave={handleUpdate} values={formProps.values}>
        <EmailVerificationRibbon values={formProps.values} />
        <FormComponent {...formProps} />
      </AutoSave>
    )}
    validationSchema={validationSchema}
  />
)

export default WizardStep
