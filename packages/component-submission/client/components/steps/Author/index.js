import React from 'react'
import { Query } from 'react-apollo'
import { CURRENT_USER } from '@elifesciences/component-elife-app/client/graphql/queries'

import AuthorPage from './AuthorPage'

const AuthorPageContainer = ({ handleSubmit, setFieldValue }) => (
  <Query query={CURRENT_USER}>
    {({ data }) => (
      <AuthorPage
        handleSubmit={handleSubmit}
        prefill={() => {
          const identity = data.currentUser.identities[0]
          setFieldValue('author.firstName', identity.meta.firstName)
          setFieldValue('author.lastName', identity.meta.lastName)
          setFieldValue('author.email', identity.email)
          setFieldValue('author.aff', identity.aff)
        }}
      />
    )}
  </Query>
)

export default AuthorPageContainer
