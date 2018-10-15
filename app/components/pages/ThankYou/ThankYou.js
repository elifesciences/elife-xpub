import React from 'react'
import styled from 'styled-components'
import { Box } from 'grid-styled'
import { th } from '@pubsweet/ui-toolkit'
import ExternalLink from '../../ui/atoms/ExternalLink'
import ButtonLink from '../../ui/atoms/ButtonLink'

const CenteredContent = styled(Box)`
  text-align: center;
`
const SubText = styled.p`
  color: ${th('colorTextSecondary')};
  font-size: ${th('fontSizeBaseSmall')};
`
const BookmarkLink = styled(ExternalLink)`
  display: inline-block;
`

const ThankYou = ({ title }) => (
  <CenteredContent mx="auto" width={[1, 600]}>
    <h1>Thank you</h1>
    <p>{`Your submission, "${title}" has been received.`}</p>
    <p>You will be informed of a decision soon.</p>
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
export default ThankYou
