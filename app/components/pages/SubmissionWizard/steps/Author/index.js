import React from 'react'
import gql from 'graphql-tag'
import { withApollo } from 'react-apollo'
import AuthorPage from './AuthorPage'

const ORCID_DETAILS_QUERY = gql`
  query GetOrcidDetails {
    orcidDetails {
      firstName
      lastName
      email
      aff
    }
  }
`

class AuthorPageContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  sanitizeAuthor = author => {
    const cleanedAuthor = JSON.parse(
      JSON.stringify(author, (key, value) => (value == null ? '' : value)),
    )

    return cleanedAuthor
  }

  runQuery = () => {
    this.setState({ loading: true, error: false })
    this.props.client
      .query({ query: ORCID_DETAILS_QUERY })
      .then(({ data }) => {
        const author = this.sanitizeAuthor(data.orcidDetails)
        this.setState({ loading: false })
        this.props.setFieldValue('author', author)
      })
      .catch(error => this.setState({ loading: false, error: error.message }))
  }
  render() {
    return (
      <AuthorPage
        fetchOrcid={this.runQuery}
        handleSubmit={this.props.handleSubmit}
        {...this.state}
      />
    )
  }
}

export default withApollo(AuthorPageContainer)
