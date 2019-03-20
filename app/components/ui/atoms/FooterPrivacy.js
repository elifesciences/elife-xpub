import React from 'react'
import FooterText from 'ui/atoms/FooterText'
import NativeLink from 'ui/atoms/NativeLink'

const FooterPrivacy = ({ customStyle }) => (
  <FooterText customStyle={customStyle}>
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
)

export default FooterPrivacy
