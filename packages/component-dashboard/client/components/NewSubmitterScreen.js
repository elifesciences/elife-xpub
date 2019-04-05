import React from 'react'
import styled from 'styled-components'
import { Box } from '@rebass/grid'
import { TwoColumnLayout } from '@elifesciences/component-elife-ui/client/global'
import media from '@elifesciences/component-elife-ui/client/global/layout/media'
import {
  Paragraph,
  ImageWrapper,
  FooterPrivacy,
  NativeLink,
} from '@elifesciences/component-elife-ui/client/atoms'
import { H1, Button } from '@pubsweet/ui'

const SmallCenterer = styled(Box).attrs({
  mx: 'auto',
  mt: 5,
  px: 5,
  width: [1, 1, 1, 1000],
})`
  min-width: 0;
  ${media.tabletPortraitUp`
  margin-top: 0;
`};
`

const NewSubmitterScreen = ({ createNewSubmission }) => (
  <SmallCenterer>
    <TwoColumnLayout mb={[0, 0, 5]}>
      <ImageWrapper image="/assets/redirect.jpg" mr="auto" />
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
            <NativeLink target="_blank" to="https://submit.elifesciences.org">
              legacy submission system
            </NativeLink>
            .
          </Paragraph.Writing>
          <Paragraph.Writing>
            If you experience any problems please{' '}
            <NativeLink
              target="_blank"
              to="https://reviewer.elifesciences.org/contact-us/contact-elife"
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
