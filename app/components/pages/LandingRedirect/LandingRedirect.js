import React from 'react'
import { Box } from '@rebass/grid'
import { H1 } from '@pubsweet/ui'
import Paragraph from 'ui/atoms/Paragraph'
import ButtonLink from 'ui/atoms/ButtonLink'
import FooterText from 'ui/atoms/FooterText'
import NativeLink from 'ui/atoms/NativeLink'
import ImageBlock from 'ui/atoms/ImageBlock'
import { RedirectLayout, TwoColumnLayout } from '../../global'

const LandingRedirect = () => (
  <RedirectLayout>
    <TwoColumnLayout mb={[0, 0, 5]}>
      <Box>
        <Box mb={4}>
          <H1>We&apos;re redirecting you</H1>
        </Box>
        <Box mb={5}>
          <Paragraph.Writing>
            eLife is working on a new submission system designed to make the
            process of publishing your research faster and simpler.
          </Paragraph.Writing>
          <Paragraph.Writing>
            We&apos;re redirecting you to our new system, which will guide you
            through the submission process.
          </Paragraph.Writing>
          <Paragraph.Writing>
            You may be asked to login using ORCID.
          </Paragraph.Writing>
        </Box>
        <ButtonLink data-test-id="redirect-continue" primary to="/">
          continue
        </ButtonLink>
      </Box>
      <ImageBlock ml="auto" image="/assets/redirect.png" />
    </TwoColumnLayout>
    <FooterText onlyCenterDesktop>
      Read our{' '}
      <NativeLink href="https://elifesciences.org/terms" target="_blank">
        Terms and conditions
      </NativeLink>{' '}
      and{' '}
      <NativeLink href="https://elifesciences.org/privacy" target="_blank">
        Privacy policy
      </NativeLink>
      .
    </FooterText>
  </RedirectLayout>
)

export default LandingRedirect
