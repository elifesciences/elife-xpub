import React from 'react'
import { Checkbox } from '@pubsweet/ui'

import ValidatedField from '../../../../ui/atoms/ValidatedField'
import CalloutBox from '../../../../ui/atoms/CalloutBox'
import Textarea from '../../../../ui/atoms/Textarea'
import { FormH3 } from '../../../../ui/atoms/FormHeadings'
import TwoColumnLayout from '../../../../global/layout/TwoColumnLayout'
import { limits } from './schema'

const createCloseHandler = (index, values, fieldName, setFieldValue) => () =>
  setFieldValue(
    fieldName,
    values[fieldName].filter((_, i) => i !== index),
    false,
  )

export const SuggestedReviewer = ({ changeHandler, index }) => (
  <TwoColumnLayout bottomSpacing={false}>
    <ValidatedField
      label={
        index < limits.suggestedReviewers.min
          ? 'Suggested reviewer name'
          : 'Optional suggested reviewer name'
      }
      name={`suggestedReviewers.${index}.name`}
      onChange={changeHandler}
    />
    <ValidatedField
      label={
        index < limits.suggestedReviewers.min
          ? 'Suggested reviewer email'
          : 'Optional suggested reviewer email'
      }
      name={`suggestedReviewers.${index}.email`}
      onChange={changeHandler}
      type="email"
    />
  </TwoColumnLayout>
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
    <TwoColumnLayout bottomSpacing={false}>
      <ValidatedField
        label="Excluded reviewer name"
        name={`opposedReviewers.${index}.name`}
      />
      <ValidatedField
        label="Excluded reviewer email"
        name={`opposedReviewers.${index}.email`}
        type="email"
      />
    </TwoColumnLayout>
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
    name="suggestionsConflict"
  />
)
