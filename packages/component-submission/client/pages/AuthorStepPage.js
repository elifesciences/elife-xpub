import React from 'react'
import ReactGA from 'react-ga'
import { compose, withHandlers } from 'recompose'
import {
  ActionText,
  ValidatedField,
} from '@elifesciences/component-elife-ui/client/atoms'
import TwoColumnLayout from '@elifesciences/component-elife-ui/client/global/layout/TwoColumnLayout'

import authorWithGQL from '../graphql/authorWithGQL'

const AuthorPage = ({ prefillDetails }) => (
  <React.Fragment>
    <p>
      <ActionText data-test-id="orcid-prefill" onClick={prefillDetails}>
        Pre-fill my details
      </ActionText>{' '}
      using ORCID
    </p>

    <TwoColumnLayout bottomSpacing={false}>
      <ValidatedField label="First name" name="author.firstName" />
      <ValidatedField label="Last name" name="author.lastName" />
      <ValidatedField
        label="Email (correspondence)"
        name="author.email"
        type="email"
      />
      <ValidatedField label="Institution" name="author.aff" />
    </TwoColumnLayout>
  </React.Fragment>
)

export default compose(
  authorWithGQL,
  withHandlers({
    prefillDetails: props => () => {
      const identity = props.data.currentUser.identities[0]
      props.setFieldValue('author.firstName', identity.meta.firstName)
      props.setFieldValue('author.lastName', identity.meta.lastName)
      props.setFieldValue('author.email', identity.email)
      props.setFieldValue('author.aff', identity.aff)

      ReactGA.event({
        category: 'User',
        action: 'Pre-filled their details',
      })
    },
  }),
)(AuthorPage)

export const fields = [
  'author.firstName',
  'author.lastName',
  'author.email',
  'author.aff',
]
