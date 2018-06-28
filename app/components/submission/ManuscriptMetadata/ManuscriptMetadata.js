import React from 'react'

import { Menu, Checkbox, Button } from '@pubsweet/ui'
import { Field } from 'formik'
import { get } from 'lodash'
import { Box } from 'grid-styled'

import ValidatedField from '../../ui/atoms/ValidatedField'
import CalloutBox from '../../ui/atoms/CalloutBox'
import ButtonLink from '../../ui/atoms/ButtonLink'
import Textarea from '../../ui/atoms/Textarea'
import ProgressBar from '../ProgressBar'
import SubjectAreaDropdown from './SubjectAreaDropdown'
import { FormH2 } from '../../ui/atoms/FormHeadings'

const CheckboxGeneratedChild = ({
  fieldName,
  checkboxLabel,
  values,
  children,
}) => (
  <Box mb={3}>
    <Box mb={2}>
      <Field
        name={fieldName}
        render={({ field }) => (
          <Checkbox {...field} checked={field.value} label={checkboxLabel} />
        )}
      />
    </Box>
    {get(values, fieldName) && <CalloutBox>{children}</CalloutBox>}
  </Box>
)

const ManuscriptMetadata = ({
  handleSubmit,
  values,
  setFieldValue,
  setFieldTouched,
}) => (
  <form noValidate onSubmit={handleSubmit}>
    <ProgressBar currentStep={2} />

    <FormH2>Help us get your work seen by the right people</FormH2>

    <ValidatedField label="Manuscript title" name="title" />
    <ValidatedField
      component={Menu}
      label="Article type"
      name="manuscriptType"
      onBlur={value => setFieldValue('manuscriptType', value)}
      onChange={value => setFieldValue('manuscriptType', value)}
      options={[
        { value: 'research-article', label: 'Research article' },
        { value: 'feature', label: 'Feature article' },
      ]}
    />

    <ValidatedField
      component={SubjectAreaDropdown}
      label="Subject areas"
      name="subjectAreas"
      onBlur={e => setFieldTouched('subjectAreas', true)}
      onChange={selectedOptions => {
        const subjectAreas = selectedOptions.map(option => option.value)
        setFieldValue('subjectAreas', subjectAreas)
      }}
      savedValues={values.subjectAreas}
    />

    <CheckboxGeneratedChild
      checkboxLabel="This manuscript has been discussed previously with an eLife editor"
      fieldName="submissionMeta.discussedPreviously"
      values={values}
    >
      <ValidatedField
        component={Textarea}
        label="What was discussed and with whom"
        name="submissionMeta.discussion"
      />
    </CheckboxGeneratedChild>

    <CheckboxGeneratedChild
      checkboxLabel="This manuscript has been considered by eLife previously"
      fieldName="submissionMeta.consideredPreviously"
      values={values}
    >
      <ValidatedField
        label="Article title/reference No"
        name="submissionMeta.previousArticle"
      />
    </CheckboxGeneratedChild>

    <CheckboxGeneratedChild
      checkboxLabel="This manuscript is a co-submission"
      fieldName="submissionMeta.cosubmission"
      values={values}
    >
      <div>
        <ValidatedField
          label="Article title"
          name="submissionMeta.cosubmissionTitle"
        />
        <ValidatedField
          label="Reference No"
          name="submissionMeta.cosubmissionId"
        />
      </div>
    </CheckboxGeneratedChild>

    <Button data-test-id="next" primary type="submit">
      Next
    </Button>
    <ButtonLink to="/submit/upload">Back</ButtonLink>
  </form>
)

export default ManuscriptMetadata
