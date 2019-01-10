import React from 'react'
import { Flex, Box } from '@rebass/grid'
import { Redirect } from 'react-router-dom'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import config from 'config'
import { H2 } from '@pubsweet/ui'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import OrcidButton from '../../ui/atoms/OrcidButton'
import ButtonLink from '../../ui/atoms/ButtonLink'
import Paragraph from '../../ui/atoms/Paragraph'
import NativeLink from '../../ui/atoms/NativeLink'
import media from '../../global/layout/media'

const { url: loginUrl, signupUrl, legacySubmissionUrl } = config.login

const EXCHANGE_TOKEN_MUTATION = gql`
  mutation($token: String) {
    exchangeJournalToken(token: $token)
  }
`
const Container = styled(Box)`
  margin-top: ${th('space.3')};
  ${media.tabletPortraitUp`
    margin-top:${'calc(50vh - 300px)'};
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
      <Container mx="auto" width={[1, 410]}>
        {/* roughly centre the box vertically */}
        <Box mb={4}>
          <H2>
            eLife is changing the way work is reviewed and selected for
            publication
          </H2>
        </Box>
        <Box mb={5}>
          <Paragraph.Writing>
            The leading scientists behind eLife are committed to rapid, fair,
            and constructive review. Before you submit your work, please note
            that eLife is a very selective journal that aims to publish work of
            the highest scientific standards and importance.
          </Paragraph.Writing>
          <Paragraph.Writing>
            Our new manuscript submission system will guide you through the
            process of submitting your research.
            {!token && ' Log in with your ORCID identifier to get started.'}
          </Paragraph.Writing>
        </Box>
        {token ? (
          <Box mb={5}>
            <ButtonLink data-test-id="continue" primary to="/">
              Continue
            </ButtonLink>
          </Box>
        ) : (
          <Flex alignItems="center" mb={5}>
            <Box mr={3}>
              <a href={loginUrl}>
                <OrcidButton data-test-id="login">Login with ORCID</OrcidButton>
              </a>
            </Box>
            <Box>
              No ORCID? <NativeLink href={signupUrl}>Sign up</NativeLink> now.
            </Box>
          </Flex>
        )}
        <Paragraph.Writing>
          For{' '}
          <NativeLink href={legacySubmissionUrl}>
            existing manuscripts
          </NativeLink>{' '}
          go to our full submission and peer review system.
        </Paragraph.Writing>
      </Container>
    )
  }
}

export default withApollo(LoginPage)
