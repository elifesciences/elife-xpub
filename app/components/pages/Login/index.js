import React from 'react'
import { Flex, Box } from '@rebass/grid'
import { Redirect } from 'react-router-dom'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import config from 'config'
import { H1 } from '@pubsweet/ui'
import styled from 'styled-components'
import ButtonOrcid from 'ui/atoms/ButtonOrcid'
import ButtonLink from 'ui/atoms/ButtonLink'
import Paragraph from 'ui/atoms/Paragraph'
import NativeLink from 'ui/atoms/NativeLink'
import FooterText from 'ui/atoms/FooterText'
import ImageWrapper from 'ui/atoms/ImageWrapper'
import media from 'global/layout/media'
import { TwoColumnLayout } from '../../global'

const { url: loginUrl, signupUrl } = config.login

const EXCHANGE_TOKEN_MUTATION = gql`
  mutation($token: String) {
    exchangeJournalToken(token: $token)
  }
`

const SmallCenterer = styled(Box).attrs({
  mx: 'auto',
  mt: 5,
  px: 5,
  width: [1, 1, 840, 840],
})`
  min-width: 0;
  ${media.tabletPortraitUp`
  margin-top: 0;
`};
`

class LoginPage extends React.Component {
  constructor(props) {
    super(props)
    // save JWT to local storage if present
    const token = this.getToken()
    if (token) {
      LoginPage.setToken(token)
      this.exchangeToken(token)
    }
  }

  exchangeToken(token) {
    this.props.client
      .mutate({
        mutation: EXCHANGE_TOKEN_MUTATION,
        variables: { token },
      })
      .then(({ data }) => LoginPage.setToken(data.exchangeJournalToken))
      .catch(err => {
        LoginPage.setToken(null)
        // TODO expose this error once we have a UI to do so
        this.props.history.push('/login', { error: err.message })
        console.error(err)
      })
  }

  static setToken(token) {
    window.localStorage.setItem('token', token)
  }

  static decodeToken(token) {
    const [, payload] = token.split('.')
    return JSON.parse(atob(payload))
  }

  // parse JWT from the URL hash
  getToken() {
    const { history } = this.props
    if (history && history.location && history.location.hash) {
      return history.location.hash.substring(1)
    }
    return null
  }

  // show login button and redirect on sign in
  render() {
    const redirectTo = '/'

    const token = this.getToken()
    if (token) {
      const data = LoginPage.decodeToken(token)
      if (data['new-session']) {
        return <Redirect to={redirectTo} />
      }
    }

    return (
      <Box>
        <SmallCenterer>
          <TwoColumnLayout mb={[0, 0, 5]}>
            <Box>
              <Box mb={4}>
                <H1>Welcome!</H1>
              </Box>
              <Box mb={5}>
                <Paragraph.Writing>
                  The leading scientists behind eLife are committed to rapid,
                  fair, and constructive review of academic research.
                </Paragraph.Writing>
                <Paragraph.Writing>
                  We welcome submissions of the highest scientific standards and
                  importance in all areas of the life and biomedical sciences.
                </Paragraph.Writing>
                <Paragraph.Writing>
                  You can read more in our{' '}
                  <NativeLink href="https://reviewer.elifesciences.org/author-guide">
                    author guide
                  </NativeLink>
                  .
                </Paragraph.Writing>
              </Box>
              {token ? (
                <Box>
                  <ButtonLink data-test-id="continue" primary to="/">
                    Continue
                  </ButtonLink>
                </Box>
              ) : (
                <Flex alignItems="center" mb={5}>
                  <Box mr={3}>
                    <a href={loginUrl}>
                      <ButtonOrcid data-test-id="login">
                        Login with ORCID
                      </ButtonOrcid>
                    </a>
                  </Box>
                  <Box>
                    <Paragraph.Writing>
                      No ORCID?{' '}
                      <NativeLink href={signupUrl}>Sign up</NativeLink> now.
                    </Paragraph.Writing>
                  </Box>
                </Flex>
              )}
            </Box>
            <ImageWrapper ml="auto" image="/assets/welcome.png" />
          </TwoColumnLayout>
          <FooterText onlyCenterDesktop>
            Read our{' '}
            <NativeLink href="https://elifesciences.org/terms" target="_blank">
              Terms and conditions
            </NativeLink>{' '}
            and{' '}
            <NativeLink
              href="https://elifesciences.org/privacy"
              target="_blank"
            >
              Privacy policy
            </NativeLink>
            .
          </FooterText>
        </SmallCenterer>
      </Box>
    )
  }
}

export default withApollo(LoginPage)
