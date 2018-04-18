import React from 'react'
import { Flex, Box } from 'grid-styled'
import { Checkbox } from '@pubsweet/ui'

import ValidatedField from '../../ui/atoms/ValidatedField'
import CalloutBox from '../../ui/atoms/CalloutBox'
import Textarea from '../../ui/atoms/Textarea'

export const SuggestedSeniorEditorRow = ({ rowIndex }) => (
  <Flex>
    <Box width={1 / 2}>
      <ValidatedField
        label="Suggested senior editor"
        name={`suggestedSeniorEditors.${rowIndex}`}
      />
    </Box>
    <Box width={1 / 2}>
      <ValidatedField
        label="Suggested senior editor"
        name={`suggestedSeniorEditors.${rowIndex + 1}`}
      />
    </Box>
  </Flex>
)

export const ExcludedSeniorEditor = ({ index }) => (
  <CalloutBox>
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
  <Flex>
    <Box width={1 / 2}>
      <ValidatedField
        label="Suggested reviewing editor"
        name={`suggestedReviewingEditors.${rowIndex}`}
      />
    </Box>
    <Box width={1 / 2}>
      <ValidatedField
        label="Suggested reviewing editor"
        name={`suggestedReviewingEditors.${rowIndex + 1}`}
      />
    </Box>
  </Flex>
)

export const ExcludedReviewingEditor = ({ index }) => (
  <CalloutBox>
    <ValidatedField
      label="Excluded reviewing editor"
      name={`opposedReviewingEditors.${index}.name`}
    />
    <ValidatedField
      component={Textarea}
      label="Reason for exclusion"
      name={`opposedSeniorEditors.${index}.reason`}
    />
  </CalloutBox>
)

export const SuggestedReviewer = ({ index }) => (
  <Flex>
    <Box width={1 / 2}>
      <ValidatedField
        label="Suggested reviewer name"
        name={`suggestedReviewers.${index}.name`}
      />
    </Box>
    <Box width={1 / 2}>
      <ValidatedField
        label="Suggested reviewer email"
        name={`suggestedReviewers.${index}.email`}
        type="email"
      />
    </Box>
  </Flex>
)
export const ExcludedReviewer = ({ index }) => (
  <CalloutBox>
    <Flex>
      <Box width={1 / 2}>
        <ValidatedField
          label="Excluded reviewer name"
          name={`opposedReviewers.${index}.name`}
        />
      </Box>
      <Box width={1 / 2}>
        <ValidatedField
          label="Excluded reviewer email"
          name={`opposedReviewers.${index}.email`}
          type="email"
        />
      </Box>
    </Flex>
    <ValidatedField
      component={Textarea}
      label="Reason for exclusion"
      name={`opposedReviewers.${index}.reason`}
    />
  </CalloutBox>
)

// pass `value` prop to `checked`
const ValueCheckbox = ({ value, validationStatus, ...props }) => (
  <Box mb={3}>
    <Checkbox checked={value} {...props} />
  </Box>
)

export const Declaration = () => (
  <Box mb={3}>
    <ValidatedField
      component={ValueCheckbox}
      label="I declare that, to the best of my knowledge, these experts have no conflict of interest"
      name="declaration"
    />
  </Box>
)
