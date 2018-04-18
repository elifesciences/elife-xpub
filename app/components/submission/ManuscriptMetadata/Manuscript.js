import React from 'react'

import { H1, Menu, Button } from '@pubsweet/ui'
import ValidatedField from '../../ui/atoms/ValidatedField'
import ButtonLink from '../../ui/atoms/ButtonLink'
import ProgressBar from '../ProgressBar'

const Manuscript = ({ handleSubmit }) => (
  <form noValidate onSubmit={handleSubmit}>
    <ProgressBar currentStep={2} />

    <H1>Help us get your work seen by the right people</H1>

    <ValidatedField label="Manuscript title" name="title" />
    <ValidatedField
      component={Menu}
      label="Article type"
      name="metadata.articleType"
      options={[
        { value: 'research-article', label: 'Research Article' },
        { value: 'feature', label: 'Feature article' },
      ]}
    />

    <Button primary type="submit">
      Next
    </Button>
    <ButtonLink to="/submit/upload">Back</ButtonLink>
  </form>
)

export default Manuscript
