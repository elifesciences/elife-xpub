import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import EditorsContent from './EditorsContent'

const EDITOR_LIST_QUERY = gql`
  query EditorList($role: ManuscriptRole!) {
    editors(role: $role) {
      id
      name
      institution
    }
  }
`

const EditorsContainer = ({ ...props }) => (
  <Query query={EDITOR_LIST_QUERY} variables={{ role: 'REVIEWINGEDITOR' }}>
    {({ data: { editors: reviewingEditors = [] } }) => (
      // TODO handle errors
      <Query query={EDITOR_LIST_QUERY} variables={{ role: 'SENIOREDITOR' }}>
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
