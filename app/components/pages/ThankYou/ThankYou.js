import React from 'react'
import styled from 'styled-components'
import { Box } from 'grid-styled'
import PropTypes from 'prop-types'
import { H1 } from '@pubsweet/ui'
import { th } from '@pubsweet/ui-toolkit'
import ExternalLink from '../../ui/atoms/ExternalLink'
import ButtonLink from '../../ui/atoms/ButtonLink'
import Paragraph from '../../ui/atoms/Paragraph'
import SmallParagraph from '../../ui/atoms/SmallParagraph'

const CenteredContent = styled(Box)`
  text-align: center;
`
const SubText = styled(SmallParagraph)`
  color: ${th('colorTextSecondary')};
`

const BookmarkLink = styled(ExternalLink)`
  display: inline-block;
  clear: both;
`

const ThankYou = ({ title }) => (
  <CenteredContent mx="auto" width={[1, 1, 1, 600]}>
    <H1>Thank you</H1>
    <Paragraph>{`Your submission, "${title}" has been received.`}</Paragraph>
    <Paragraph>You will be informed of a decision soon.</Paragraph>
    <SubText>
      You may want to bookmark the link below to check the progress of your
      submission.
      <BookmarkLink href="/">elifesciences.org/submissions</BookmarkLink>
    </SubText>
    <ButtonLink primary to="/">
      Finish
    </ButtonLink>
  </CenteredContent>
)

ThankYou.propTypes = {
  title: PropTypes.string.isRequired,
}

export default ThankYou
