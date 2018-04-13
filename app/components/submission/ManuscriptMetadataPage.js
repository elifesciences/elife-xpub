import React from 'react'
import { H1 } from '@pubsweet/ui'
import ButtonLink from '../ui/atoms/ButtonLink'

export default () => (
  <React.Fragment>
    <H1>Help us get your work seen by the right people</H1>

    <ButtonLink primary to="/submit/suggestions">
      Next
    </ButtonLink>
    <ButtonLink to="/submit/upload">Back</ButtonLink>
  </React.Fragment>
)
