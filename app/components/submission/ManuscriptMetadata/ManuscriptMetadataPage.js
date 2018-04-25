import React from 'react'
import { H1 } from '@pubsweet/ui'
import ButtonLink from '../../ui/atoms/ButtonLink'
import ProgressBar from '../ProgressBar'

export default () => (
  <React.Fragment>
    <ProgressBar currentStep={2} />

    <H1>Help us get your work seen by the right people</H1>

    <ButtonLink data-test-id="next" primary to="/submit/suggestions">
      Next
    </ButtonLink>
    <ButtonLink to="/submit/upload">Back</ButtonLink>
  </React.Fragment>
)
