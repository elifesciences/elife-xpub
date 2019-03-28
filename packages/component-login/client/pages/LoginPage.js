import React from 'react'
import { Flex, Box } from '@rebass/grid'
import { Redirect } from 'react-router-dom'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import config from 'config'
import { H1 } from '@pubsweet/ui'
import styled, { css } from 'styled-components'
import {
  ButtonLink,
  Paragraph,
  NativeLink,
  ImageWrapper,
  FooterPrivacy,
} from '@elifesciences/component-elife-ui/client/atoms'
import { TwoColumnLayout } from '@elifesciences/component-elife-ui/client/global'
import media from '@elifesciences/component-elife-ui/client/global/layout/media'
import ButtonOrcid from '../components/ButtonOrcid'

const { url: loginUrl, signupUrl } = config.login

const EXCHANGE_TOKEN_MUTATION = gql`
  mutation($token: String) {
    exchangeJournalToken(token: $token)
  }
`

const SmallCenterer = styled(Box).attrs({
  mt: 5,
  width: '100%',
})`
  max-width: 432px;
  min-width: 0;
  margin-top: 24px;
  ${media.mobileUp`
  margin-top: 72px;
`};
  ${media.tabletPortraitUp`
  margin-top: 0;
  max-width: 454px;
`};
  ${media.tabletLandscapeUp`
  max-width: 786px;
`};
  ${media.desktopUp`
  max-width: 840px;
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
        // eslint-disable-next-line no-console
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

    const footerStyle = css`
      text-align: left;
      ${media.tabletLandscapeUp`
        text-align: center;
      `};
    `

    return (
      <Flex justifyContent="center">
        <SmallCenterer mx={3}>
          <TwoColumnLayout
            bottomSpacing={false}
            customWidth={[1, 1, 1, 1 / 2]}
            mb={[5, 5, 5, 7]}
            paddingX={0}
          >
            <Box>
              <Box mb={0}>
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
                <Flex alignItems="center">
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
            <ImageWrapper image="/assets/welcome.jpg" ml="auto" />
          </TwoColumnLayout>
          <Box mx={-2}>
            <FooterPrivacy customStyle={footerStyle} />
          </Box>
        </SmallCenterer>
      </Flex>
    )
  }
}

export default withApollo(LoginPage)
