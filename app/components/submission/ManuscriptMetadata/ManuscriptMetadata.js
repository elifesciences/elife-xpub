import React from 'react'

import { H1, Menu, Checkbox, Button } from '@pubsweet/ui'
import { Field } from 'formik'

import ValidatedField from '../../ui/atoms/ValidatedField'
import CalloutBox from '../../ui/atoms/CalloutBox'
import ButtonLink from '../../ui/atoms/ButtonLink'
import Textarea from '../../ui/atoms/Textarea'
import ProgressBar from '../ProgressBar'

const ManuscriptMetadata = ({ handleSubmit, values, setFieldValue }) => (
  <form noValidate onSubmit={handleSubmit}>
    <ProgressBar currentStep={2} />

    <H1>Help us get your work seen by the right people</H1>

    <ValidatedField label="Manuscript title" name="title" />
    <ValidatedField
      component={Menu}
      label="Article type"
      name="metadata.articleType"
      onBlur={value => setFieldValue('metadata.articleType', value)}
      onChange={value => setFieldValue('metadata.articleType', value)}
      options={[
        { value: 'research-article', label: 'Research article' },
        { value: 'feature', label: 'Feature article' },
      ]}
    />

    <CalloutBox enabled={values.metadata.discussedPreviously}>
      <Field
        name="metadata.discussedPreviously"
        render={({ field }) => (
          <Checkbox
            {...field}
            checked={field.value}
            label="This manuscript has been discussed previously with an eLife editor"
          />
        )}
      />
      {values.metadata.discussedPreviously && (
        <ValidatedField
          component={Textarea}
          label="What was discussed and with whom"
          name="metadata.discussion"
        />
      )}
    </CalloutBox>

    <CalloutBox enabled={values.metadata.consideredPreviously}>
      <Field
        name="metadata.consideredPreviously"
        render={({ field }) => (
          <Checkbox
            {...field}
            checked={field.value}
            label="This manuscript has been considered by eLife previously"
          />
        )}
      />
      {values.metadata.consideredPreviously && (
        <ValidatedField
          label="Article title/reference No"
          name="metadata.previousArticle"
        />
      )}
    </CalloutBox>

    <CalloutBox enabled={values.metadata.cosubmission}>
      <Field
        name="metadata.cosubmission"
        render={({ field }) => (
          <Checkbox
            {...field}
            checked={field.value}
            label="This manuscript is a co-submission"
          />
        )}
      />
      {values.metadata.cosubmission && (
        <div>
          <ValidatedField
            label="Article title"
            name="metadata.cosubmissionTitle"
          />
          <ValidatedField label="Reference No" name="metadata.cosubmissionId" />
        </div>
      )}
    </CalloutBox>

    <Button primary type="submit">
      Next
    </Button>
    <ButtonLink to="/submit/upload">Back</ButtonLink>
  </form>
)

export default ManuscriptMetadata
