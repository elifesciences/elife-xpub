import React from 'react'
import styled from 'styled-components'
import { Box } from 'grid-styled'
import { th } from '@pubsweet/ui-toolkit'
import { format, parse } from 'date-fns'

import Paragraph from '../../../../ui/atoms/Paragraph'
import SmallParagraph from '../../../../ui/atoms/SmallParagraph'
import NativeLink from '../../../../ui/atoms/NativeLink'
import { FormH3 } from '../../../../ui/atoms/FormHeadings'
import ValidatedField from '../../../../ui/atoms/ValidatedField'
import ControlledCheckbox from '../../../../ui/atoms/ControlledCheckbox'

const StyledSmallParagraph = styled(SmallParagraph)`
  color: ${th('colorTextSecondary')};
`

const localDate = parse(new Date())
const formattedLocalDate = format(localDate, 'MMM D, YYYY')

const DisclosurePage = ({ values }) => {
  const formattedArticleType = values.meta.articleType
    .toUpperCase()
    .replace(/-+/g, ' ')

  return (
    <React.Fragment>
      <Box mb={4}>
        <FormH3>{values.meta.title}</FormH3>
        <Paragraph>
          {values.author.firstName} {values.author.lastName}
        </Paragraph>
        <StyledSmallParagraph>
          {formattedArticleType} {formattedLocalDate}
        </StyledSmallParagraph>
      </Box>
      <Box mb={4}>
        <Paragraph>
          Our{' '}
          <NativeLink
            href="https://elifesciences.org/privacy-notice"
            target="_blank"
          >
            privacy policy
          </NativeLink>{' '}
          explains that we share your personal information with various third
          parties to enable us to review and publish your manuscript, and that
          we protect your data with detailed contractual arrangements with those
          parties. One of the groups we need to share your data with is our
          international editors, guest editors, and potentially peer reviewers.
          Since they are carrying out their roles as individuals, it is
          impracticable for us to have such comprehensive contractual protection
          for your data with them as we have with other third parties. This
          means that your personal data is unlikely to have the same level of
          protection as it would if those editors and guest reviewers were based
          in the UK. Because of this risk, we ask for your explicit consent to
          share your personal data with them, which you can withdraw at any time
          (by emailing{' '}
          <NativeLink href="mailto:data@elifesciences.org">
            data@elifesciences.org
          </NativeLink>
          ). Please enter your name and check the box below to give this
          consent. Without this consent we will not be able to evaluate your
          submission.
        </Paragraph>
      </Box>
      <Box mb={3} w={1 / 2}>
        <ValidatedField
          label="Acknowledged by (Name):"
          name="submitterSignature"
        />
      </Box>
      <ValidatedField
        component={ControlledCheckbox}
        label="I agree on behalf of all authors"
        name="disclosureConsent"
      />
    </React.Fragment>
  )
}

export default DisclosurePage
