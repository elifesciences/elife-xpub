import React from 'react'
import styled from 'styled-components'
import { Box } from '@rebass/grid'
import PropTypes from 'prop-types'
import { H1 } from '@pubsweet/ui'
import config from 'config'

import {
  NativeLink,
  ButtonLink,
  Paragraph,
} from '@elifesciences/component-elife-ui/client/atoms'

const CenteredContent = styled(Box)`
  text-align: center;
`
const SubText = styled(Paragraph.Small).attrs({ secondary: true })``

const BookmarkLink = styled(NativeLink)`
  display: inline-block;
  clear: both;
`

class ThankYou extends React.Component {
  componentDidMount() {
    if (config.hotJar.enabled) {
      window.hj('trigger', 'thank_you_page_hotjar_feedback')
    }
  }

  render() {
    const { title } = this.props
    return (
      <CenteredContent mx="auto" width={[1, 1, 1, 600]}>
        <H1>Thank you</H1>
        <Paragraph.Reading data-hj-suppress="" data-test-id="title">
          Your submission, &quot;
          {title}
          &quot; has been received.
        </Paragraph.Reading>
        <Paragraph.Reading>
          You will be informed of a decision soon.
        </Paragraph.Reading>
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
