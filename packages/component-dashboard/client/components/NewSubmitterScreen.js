import React from 'react'
import { Box } from '@rebass/grid'
import { TwoColumnLayout } from '@elifesciences/component-elife-ui/client/global'
import {
  Paragraph,
  CreditedImage,
  FooterPrivacy,
  NativeLink,
  SmallCenterer,
} from '@elifesciences/component-elife-ui/client/atoms'
import { H1, Button } from '@pubsweet/ui'

const NewSubmitterScreen = ({ createNewSubmission }) => (
  <SmallCenterer>
    <TwoColumnLayout mb={[0, 0, 5]}>
      <CreditedImage image="/assets/before-you-start.jpg" mr="auto" />
      <Box>
        <Box mb={4}>
          <H1>Before you start</H1>
        </Box>
        <Box mb={5}>
          <Paragraph.Writing>
            We&apos;re working on a new submission system designed to make the
            process of publishing your research faster and simpler.
          </Paragraph.Writing>
          <Paragraph.Writing>
            If you&apos;re looking for a previous submission with eLife or want
            to submit a <strong>research advance</strong> please use our{' '}
            <NativeLink href="https://submit.elifesciences.org" target="_blank">
              legacy submission system
            </NativeLink>
            .
          </Paragraph.Writing>
          <Paragraph.Writing>
            If you experience any problems please{' '}
            <NativeLink
              href="https://reviewer.elifesciences.org/contact-us/contact-elife"
              target="_blank"
            >
              contact us
            </NativeLink>
            .
          </Paragraph.Writing>
        </Box>
        <Button
          data-test-id="desktop-new-submission"
          onClick={createNewSubmission}
          primary
        >
          start a new submission
        </Button>
      </Box>
    </TwoColumnLayout>
    <FooterPrivacy />
  </SmallCenterer>
)

export default NewSubmitterScreen
