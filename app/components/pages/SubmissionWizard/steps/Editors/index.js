import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import EditorsPage from './EditorsPage'

const EDITOR_LIST_QUERY = gql`
  query EditorList($role: String!) {
    editors(role: $role) {
      id
      name
      aff
      focuses
      expertises
    }
  }
`

const EditorsPageContainer = ({ ...props }) => (
  <Query query={EDITOR_LIST_QUERY} variables={{ role: 'reviewing-editor' }}>
    {({ data: { editors: reviewingEditors = [] } }) => (
      // TODO handle errors
      <Query
        query={EDITOR_LIST_QUERY}
        variables={{ role: 'senior-editor,leadership' }}
      >
        {({ data: { editors: seniorEditors = [] } }) => (
          <EditorsPage
            reviewingEditors={reviewingEditors}
            seniorEditors={seniorEditors}
            {...props}
          />
        )}
      </Query>
    )}
  </Query>
)

export default EditorsPageContainer
