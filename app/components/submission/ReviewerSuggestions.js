import React from 'react'
import { Flex, Box } from 'grid-styled'
import { Button, H1 } from '@pubsweet/ui'

import ValidatedField from '../ui/atoms/ValidatedField'
import ButtonLink from '../ui/atoms/ButtonLink'

const ReviewerSuggestions = ({ handleSubmit }) => (
  <form noValidate onSubmit={handleSubmit}>
    <H1>Who would you like to review your work?</H1>

    <ValidatedField label="Suggested editor(s)" name="suggestedEditors" />
    <ValidatedField label="Excluded editor(s)" name="excludedEditors" />
    <Flex>
      <Box width={1 / 2}>
        <ValidatedField
          label="Suggested reviewer name"
          name="suggestedReviewerName"
        />
      </Box>
      <Box width={1 / 2}>
        <ValidatedField
          label="Suggested reviewer email"
          name="suggestedReviewerEmail"
          type="email"
        />
      </Box>
    </Flex>

    <Flex>
      <Box width={1 / 2}>
        <ValidatedField
          label="Excluded reviewer name"
          name="excludedReviewerName"
        />
      </Box>
      <Box width={1 / 2}>
        <ValidatedField
          label="Excluded reviewer email"
          name="exludedReviewerEmail"
          type="email"
        />
      </Box>
    </Flex>

    <Button primary type="submit">
      Next
    </Button>
    <ButtonLink to="/submit/metadata">Back</ButtonLink>
  </form>
)

export default ReviewerSuggestions
