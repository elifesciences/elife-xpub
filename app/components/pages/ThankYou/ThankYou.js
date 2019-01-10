import React from 'react'
import styled from 'styled-components'
import { Box } from '@rebass/grid'
import PropTypes from 'prop-types'
import { H1 } from '@pubsweet/ui'
import { hotjar } from 'react-hotjar'

import NativeLink from '../../ui/atoms/NativeLink'
import ButtonLink from '../../ui/atoms/ButtonLink'
import Paragraph from '../../ui/atoms/Paragraph'

const CenteredContent = styled(Box)`
  text-align: center;
`
const SubText = styled(Paragraph.Small).attrs({ secondary: true })``

const BookmarkLink = styled(NativeLink)`
  display: inline-block;
  clear: both;
`

const hotJarId = 443270
const hotjarSnippetVersion = 6

class ThankYou extends React.Component {
  componentDidMount() {
    window.hj('trigger', 'thank_you_page_hotjar_feedback')
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
    hotjar.initialize(hotJarId, hotjarSnippetVersion)
    const { title } = this.props
    return (
      <CenteredContent mx="auto" width={[1, 1, 1, 600]}>
        <H1>Thank you</H1>
        <Paragraph.Writing>
          Your submission, &quot;
          {title}
          &quot; has been received.
        </Paragraph.Writing>
        <Paragraph.Writing>
          You will be informed of a decision soon.
        </Paragraph.Writing>
        <SubText>
          You may want to bookmark the link below to check the progress of your
          submission.
          <BookmarkLink href="/">elifesciences.org/submissions</BookmarkLink>
        </SubText>
        <ButtonLink data-test-id="finish" primary to="/">
          Finish
        </ButtonLink>
      </CenteredContent>
    )
  }
}

ThankYou.propTypes = {
  title: PropTypes.string.isRequired,
}

export default ThankYou
