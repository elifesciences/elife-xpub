import React from 'react'
import styled from 'styled-components'
import { Box } from '@rebass/grid'
import { H1 } from '@pubsweet/ui'
import Paragraph from 'ui/atoms/Paragraph'
import ButtonLink from 'ui/atoms/ButtonLink'
import FooterText from 'ui/atoms/FooterText'
import NativeLink from 'ui/atoms/NativeLink'
import { RedirectLayout, TwoColumnLayout } from '../../global'

const ImageBlock = styled(Box)`
  width:75%
  height: 100%;
  background-image: url("/assets/redirect.png");
  background-size: cover;
  background-position: center;
`

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
        <ButtonLink primary to="/">
          continue
        </ButtonLink>
      </Box>
      <ImageBlock ml="auto" />
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
