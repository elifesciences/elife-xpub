import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

class SaveOnMount extends Component {
  componentDidMount() {
    this.props.onMount()
  }

  render() {
    return this.props.children || null
  }
}

const SAVE_PAGE = gql`
  mutation SavePage($url: String!, $id: String!) {
    savePage(url: $url, id: $id) {
      lastStepVisited
      id
    }
  }
`

const SavePageStatus = ({ url, id }) => (
  <Mutation mutation={SAVE_PAGE} variables={{ url, id }}>
    {savePage => <SaveOnMount onMount={savePage} />}
  </Mutation>
)

export default SavePageStatus
