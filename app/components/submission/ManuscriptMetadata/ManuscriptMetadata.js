import React from 'react'

import { H1, Menu, Checkbox, Button } from '@pubsweet/ui'
import { Field } from 'formik'
import { get } from 'lodash'

import ValidatedField from '../../ui/atoms/ValidatedField'
import CalloutBox from '../../ui/atoms/CalloutBox'
import ButtonLink from '../../ui/atoms/ButtonLink'
import Textarea from '../../ui/atoms/Textarea'
import ProgressBar from '../ProgressBar'

const CheckboxGeneratedChild = ({
  values,
  fieldName,
  checkboxStatus,
  checkboxLabel,
  children,
  ...props
}) => (
  <CalloutBox enabled={get(values, fieldName)}>
    <Field
      name={fieldName}
      render={({ field }) => (
        <Checkbox {...field} checked={field.value} label={checkboxLabel} />
      )}
    />
    {get(values, fieldName) && children}
  </CalloutBox>
)

const ManuscriptMetadata = ({ handleSubmit, values, setFieldValue }) => (
  <form noValidate onSubmit={handleSubmit}>
    <ProgressBar currentStep={2} />

    <H1>Help us get your work seen by the right people</H1>

    <ValidatedField label="Manuscript title" name="title" />
    <ValidatedField
      component={Menu}
      data-test-id="articleType"
      label="Article type"
      name="metadata.articleType"
      onBlur={value => setFieldValue('metadata.articleType', value)}
      onChange={value => setFieldValue('metadata.articleType', value)}
      options={[
        { value: 'research-article', label: 'Research article' },
        { value: 'feature', label: 'Feature article' },
      ]}
    />

    <CheckboxGeneratedChild
      checkboxLabel="This manuscript has been discussed previously with an eLife editor"
      fieldName="metadata.discussedPreviously"
      values={values}
    >
      <ValidatedField
        component={Textarea}
        label="What was discussed and with whom"
        name="metadata.discussion"
      />
    </CheckboxGeneratedChild>

    <CheckboxGeneratedChild
      checkboxLabel="This manuscript has been considered by eLife previously"
      fieldName="metadata.consideredPreviously"
      values={values}
    >
      <ValidatedField
        label="Article title/reference No"
        name="metadata.previousArticle"
      />
    </CheckboxGeneratedChild>

    <CheckboxGeneratedChild
      checkboxLabel="This manuscript is a co-submission"
      fieldName="metadata.cosubmission"
      values={values}
    >
      <div>
        <ValidatedField
          label="Article title"
          name="metadata.cosubmissionTitle"
        />
        <ValidatedField label="Reference No" name="metadata.cosubmissionId" />
      </div>
    </CheckboxGeneratedChild>

    <Button data-test-id="next" primary type="submit">
      Next
    </Button>
    <ButtonLink to="/submit/upload">Back</ButtonLink>
  </form>
)

export default ManuscriptMetadata
