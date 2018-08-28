import React from 'react'
import { Checkbox } from '@pubsweet/ui'

import ValidatedField from '../../../../ui/atoms/ValidatedField'
import TwoColumnLayout from '../../../../global/layout/TwoColumnLayout'
import { limits } from './schema'

export const SuggestedReviewer = ({ changeHandler, index }) => (
  <TwoColumnLayout bottomSpacing={false}>
    <ValidatedField
      label={
        index < limits.suggestedReviewers.min
          ? `Reviewer ${index + 1} name`
          : `Reviewer ${index + 1} name (optional)`
      }
      name={`suggestedReviewers.${index}.name`}
      onChange={changeHandler}
    />
    <ValidatedField
      label={
        index < limits.suggestedReviewers.min
          ? `Reviewer ${index + 1} email`
          : `Reviewer ${index + 1} email (optional)`
      }
      name={`suggestedReviewers.${index}.email`}
      onChange={changeHandler}
      type="email"
    />
  </TwoColumnLayout>
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
