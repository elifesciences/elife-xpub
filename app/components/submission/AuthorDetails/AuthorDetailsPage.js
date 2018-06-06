import React from 'react'
import gql from 'graphql-tag'
import { withApollo } from 'react-apollo'
import AuthorDetails from './AuthorDetails'

const ORCID_DETAILS_QUERY = gql`
  query GetOrcidDetails {
    orcidDetails {
      firstName
      lastName
      email
      institution
    }
  }
`

class AuthorDetailsPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  runQuery = () => {
    this.setState({ loading: true, error: false })
    this.props.client
      .query({ query: ORCID_DETAILS_QUERY })
      .then(({ data }) => {
        this.setState({ loading: false })
        this.props.setFieldValue('submissionMeta.author', data.orcidDetails)
      })
      .catch(error => this.setState({ loading: false, error: error.message }))
  }
  render() {
    return (
      <AuthorDetails
        fetchOrcid={this.runQuery}
        handleSubmit={this.props.handleSubmit}
        {...this.state}
      />
    )
  }
}

export default withApollo(AuthorDetailsPage)
