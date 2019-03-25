import React from 'react'
import { Box } from '@rebass/grid'
import { Button } from '@pubsweet/ui'
import FooterMessage from 'ui/atoms/FooterMessage'
import NativeLink from 'ui/atoms/NativeLink'
import Helpers from './helpers'

// This Cookie Notice component is based on the journals implementation: https://github.com/elifesciences/pattern-library/blob/develop/assets/js/components/CookieOverlay.js
class CookieNotice extends React.Component {
  constructor(props) {
    super(props)
    this.document = props.document || document

    this.state = {
      visible: !this.previouslyAccepted(),
    }
  }

  previouslyAccepted() {
    return Helpers.getCookieValue(
      'cookieNotificationAccepted',
      this.document.cookie,
    )
  }

  acceptNotice = () => {
    const expiryDate = 'Tue, 19 January 2038 03:14:07 UTC'
    const cookieString = `cookieNotificationAccepted=true; expires=${expiryDate}; path=/; domain=${
      this.document.domain
    };`
    this.document.cookie = cookieString
    this.setState({ visible: false })
  }

  render() {
    if (this.state.visible) {
      return (
        <FooterMessage>
          <Box mx="auto" width={[1, 1, 1, 1, 1 / 2]}>
            This site uses cookies to deliver its services and analyse traffic.
            By using this site, you agree to its use of cookies.
          </Box>
          <NativeLink href="https://elifesciences.org/privacy" target="_blank">
            Learn more.
          </NativeLink>
          <Box mt={2} width={1}>
            <Button
              data-test-id="cookieAcceptButton"
              onClick={this.acceptNotice}
              primary
              small
            >
              got it
            </Button>
          </Box>
        </FooterMessage>
      )
    }

    return null
  }
}

export default CookieNotice
