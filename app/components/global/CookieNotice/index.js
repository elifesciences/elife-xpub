import React from 'react'
import { Box } from '@rebass/grid'
import FooterMessage from 'ui/atoms/FooterMessage'
import NativeLink from 'ui/atoms/NativeLink'
import Helpers from './helpers'

class CookieNotice extends React.Component {
  constructor(props) {
    super(props)
    this.document = props.document || document

    this.state = {
      visible: !this.previouslyAccepted(),
    }
  }

  previouslyAccepted() {
    return Helpers.getCookieValue('previouslyAccepted', this.document.cookie)
  }

  render() {
    if (this.state.visible) {
      return (
        <FooterMessage>
          <Box mx="auto" width={[1, 1, 1, 1, 1 / 2]}>
            This site uses cookies to deliver its services and analyse traffic.
            By using this site, you agree to its use of cookies.{' '}
            <NativeLink
              href="https://elifesciences.org/privacy"
              target="_blank"
            >
              Learn more.
            </NativeLink>
          </Box>
        </FooterMessage>
      )
    }

    return null
  }
}

export default CookieNotice
