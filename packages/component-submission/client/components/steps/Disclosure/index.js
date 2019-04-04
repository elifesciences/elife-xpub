import React from 'react'
import { Box } from '@rebass/grid'
import { format, parse } from 'date-fns'

import {
  Paragraph,
  NativeLink,
  ValidatedField,
  ControlledCheckbox,
} from '@elifesciences/component-elife-ui/client/atoms'
import { FormH3 } from '@elifesciences/component-elife-ui/client/atoms/FormHeadings'

import { getErrorStepsFromErrors } from '../logic/getErrorStepsFromErrors'

const localDate = parse(new Date())
const formattedLocalDate = format(localDate, 'MMM D, YYYY')

const generateReadableStepsList = steps => (
    `"${ 
    [steps.slice(0, -1).join('", "'), steps.slice(-1)[0]].join(
      steps.length < 2 ? '' : '" and "',
    ) 
    }"`
  )
const DisclosurePage = ({ values, errors }) => {
  const formattedArticleType = values.meta.articleType
    .toUpperCase()
    .replace(/-+/g, ' ')
  return (
    <React.Fragment>
      <Box mb={4}>
        <FormH3 data-hj-suppress="" data-test-id="disclosure-title">
          {values.meta.title}
        </FormH3>
        <Paragraph.Reading data-hj-suppress="" data-test-id="disclosure-name">
          {values.author.firstName} {values.author.lastName}
        </Paragraph.Reading>
        <Paragraph.Small secondary>
          {formattedArticleType} {formattedLocalDate}
        </Paragraph.Small>
      </Box>
      <Box mb={4}>
        <Paragraph.Reading>
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
        </Paragraph.Reading>
      </Box>
      <Box mb={3}>
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
      {!!Object.keys(errors).length &&
        `We're sorry but there appears to be one or more errors in your submission that require attention before you can submit. Please use the back button to review your ${generateReadableStepsList(
          getErrorStepsFromErrors(errors),
        )} and try again.`}
    </React.Fragment>
  )
}

export default DisclosurePage
