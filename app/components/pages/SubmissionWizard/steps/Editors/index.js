import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import EditorsContent from './EditorsContent'

const EDITOR_LIST_QUERY = gql`
  query EditorList($role: String!) {
    editors(role: $role) {
      id
      name
      institution
      subjectAreas
    }
  }
`

const EditorsContainer = ({ ...props }) => (
  <Query query={EDITOR_LIST_QUERY} variables={{ role: 'reviewing-editor' }}>
    {({ data: { editors: reviewingEditors = [] } }) => (
      // TODO handle errors
      <Query query={EDITOR_LIST_QUERY} variables={{ role: 'senior-editor' }}>
        {({ data: { editors: seniorEditors = [] } }) => (
          <EditorsContent
            reviewingEditors={reviewingEditors}
            seniorEditors={seniorEditors}
            {...props}
          />
        )}
      </Query>
    )}
  </Query>
)

export default EditorsContainer
