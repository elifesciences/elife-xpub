import React from 'react'
import { Flex, Box } from 'grid-styled'
import { Redirect } from 'react-router-dom'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import config from 'config'
import { H2 } from '@pubsweet/ui'
import OrcidButton from '../../ui/atoms/OrcidButton'
import Paragraph from '../../ui/atoms/Paragraph'
import ExternalLink from '../../ui/atoms/ExternalLink'

const EXCHANGE_TOKEN_MUTATION = gql`
  mutation($token: String) {
    exchangeJournalToken(token: $token)
  }
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
    const loginUrl = config.login.url

    if (this.getToken()) {
      return <Redirect to={redirectTo} />
    }

    return (
      <Flex>
        {/* roughly centre the box vertically */}
        <Box mt="calc(50vh - 300px)" mx="auto" width={[1, 2 / 3, 1 / 2, 1 / 3]}>
          <Box mb={4}>
            <H2>
              eLife is changing the way work is reviewed and selected for
              publication
            </H2>
          </Box>
          <Box mb={5}>
            <Paragraph>
              The leading scientists behind eLife are committed to rapid, fair,
              and constructive review. Before you submit your work, please note
              that eLife is a very selective journal that aims to publish work
              of the highest scientific standards and importance.
            </Paragraph>
          </Box>
          <Box mb={5}>
            <a href={loginUrl}>
              <OrcidButton data-test-id="login">Login with Orcid</OrcidButton>
            </a>
          </Box>
          <Paragraph>
            Are you a reviewer?{' '}
            <ExternalLink href="https://submit.elifesciences.org">
              Go to our reviewer portal.
            </ExternalLink>
          </Paragraph>
        </Box>
      </Flex>
    )
  }
}

export default withApollo(LoginPage)
