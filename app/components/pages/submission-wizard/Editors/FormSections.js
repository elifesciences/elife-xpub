import React from 'react'
import { Checkbox } from '@pubsweet/ui'

import ValidatedField from '../../../ui/atoms/ValidatedField'
import CalloutBox from '../../../ui/atoms/CalloutBox'
import Textarea from '../../../ui/atoms/Textarea'
import { FormH3 } from '../../../ui/atoms/FormHeadings'
import TwoColumnRow from '../TwoColumnRow'

const createCloseHandler = (index, values, fieldName, setFieldValue) => () =>
  setFieldValue(
    fieldName,
    values[fieldName].filter((_, i) => i !== index),
    false,
  )

export const SuggestedSeniorEditorRow = ({ rowIndex }) => (
  <TwoColumnRow
    left={
      <ValidatedField
        label="Suggested senior editor"
        name={`suggestedSeniorEditors.${rowIndex}`}
      />
    }
    right={
      <ValidatedField
        label="Suggested senior editor"
        name={`suggestedSeniorEditors.${rowIndex + 1}`}
      />
    }
  />
)

export const ExcludedSeniorEditor = ({ index, values, setFieldValue }) => (
  <CalloutBox
    onClose={createCloseHandler(
      index,
      values,
      'opposedSeniorEditors',
      setFieldValue,
    )}
  >
    <FormH3>Exclude a Senior Editor</FormH3>
    <ValidatedField
      label="Excluded senior editor"
      name={`opposedSeniorEditors.${index}.name`}
    />
    <ValidatedField
      component={Textarea}
      label="Reason for exclusion"
      name={`opposedSeniorEditors.${index}.reason`}
    />
  </CalloutBox>
)

export const SuggestedReviewingEditorRow = ({ rowIndex }) => (
  <TwoColumnRow
    left={
      <ValidatedField
        label="Suggested reviewing editor"
        name={`suggestedReviewingEditors.${rowIndex}`}
      />
    }
    right={
      <ValidatedField
        label="Suggested reviewing editor"
        name={`suggestedReviewingEditors.${rowIndex + 1}`}
      />
    }
  />
)

export const ExcludedReviewingEditor = ({ index, values, setFieldValue }) => (
  <CalloutBox
    onClose={createCloseHandler(
      index,
      values,
      'opposedReviewingEditors',
      setFieldValue,
    )}
  >
    <FormH3>Exclude a Reviewing Editor</FormH3>
    <ValidatedField
      label="Excluded reviewing editor"
      name={`opposedReviewingEditors.${index}.name`}
    />
    <ValidatedField
      component={Textarea}
      label="Reason for exclusion"
      name={`opposedReviewingEditors.${index}.reason`}
    />
  </CalloutBox>
)

export const SuggestedReviewer = ({ index }) => (
  <TwoColumnRow
    left={
      <ValidatedField
        label="Suggested reviewer name"
        name={`suggestedReviewers.${index}.name`}
      />
    }
    right={
      <ValidatedField
        label="Suggested reviewer email"
        name={`suggestedReviewers.${index}.email`}
        type="email"
      />
    }
  />
)

export const ExcludedReviewer = ({ index, values, setFieldValue }) => (
  <CalloutBox
    onClose={createCloseHandler(
      index,
      values,
      'opposedReviewers',
      setFieldValue,
    )}
  >
    <FormH3>Exclude a Reviewer</FormH3>
    <TwoColumnRow
      left={
        <ValidatedField
          label="Excluded reviewer name"
          name={`opposedReviewers.${index}.name`}
        />
      }
      right={
        <ValidatedField
          label="Excluded reviewer email"
          name={`opposedReviewers.${index}.email`}
          type="email"
        />
      }
    />
    <ValidatedField
      component={Textarea}
      label="Reason for exclusion"
      name={`opposedReviewers.${index}.reason`}
    />
  </CalloutBox>
)

// pass `value` prop to `checked`
const ValueCheckbox = ({ value, validationStatus, ...props }) => (
  <Checkbox checked={value} {...props} />
)

export const Declaration = () => (
  <ValidatedField
    component={ValueCheckbox}
    label="I declare that, to the best of my knowledge, these experts have no conflict of interest"
    name="noConflictOfInterest"
  />
)
