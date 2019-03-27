import React from 'react'
import { Box } from '@rebass/grid'
import { H1 } from '@pubsweet/ui'
import Paragraph from 'ui/atoms/Paragraph'
import ButtonLink from 'ui/atoms/ButtonLink'
import ImageWrapper from 'ui/atoms/ImageWrapper'
import FooterPrivacy from 'ui/atoms/FooterPrivacy'
import { css } from 'styled-components'
import media from 'global/layout/media'
import { RedirectLayout, TwoColumnLayout } from 'global'

const footerStyle = css`
  text-align: left;
  ${media.desktopUp`
    text-align: center;
  `};
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
        <ButtonLink data-test-id="redirect-continue" primary to="/">
          continue
        </ButtonLink>
      </Box>
      <ImageWrapper image="/assets/redirect.jpg" ml="auto" />
    </TwoColumnLayout>
    <FooterPrivacy customStyle={footerStyle} />
  </RedirectLayout>
)

export default LandingRedirect
