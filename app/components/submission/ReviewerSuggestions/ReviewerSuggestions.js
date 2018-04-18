import React from 'react'
import { Box } from 'grid-styled'
import { Button, H1, PlainButton } from '@pubsweet/ui'

import ButtonLink from '../../ui/atoms/ButtonLink'
import ProgressBar from '../ProgressBar'
import {
  Declaration,
  ExcludedReviewer,
  ExcludedReviewingEditor,
  ExcludedSeniorEditor,
  SuggestedReviewer,
  SuggestedReviewingEditorRow,
  SuggestedSeniorEditorRow,
} from './FormSections'

const MoreButton = ({
  empty,
  fieldName,
  roleName,
  setFieldValue,
  type = 'suggest',
  more = 'another',
  values,
}) => (
  <PlainButton
    onClick={() =>
      setFieldValue(fieldName, values[fieldName].concat(empty), false)
    }
    type="button"
  >
    {type} {values[fieldName].length ? more : 'a'} {roleName}
  </PlainButton>
)

const MAX_EXCLUDED_EDITORS = 2

const ReviewerSuggestions = ({
  handleSubmit,
  values,
  setValues,
  setFieldValue,
}) => (
  <form noValidate onSubmit={handleSubmit}>
    <ProgressBar currentStep={3} />

    <H1>Who would you like to review your work?</H1>

    <SuggestedSeniorEditorRow rowIndex={0} />

    {values.opposedSeniorEditors.map((_, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <ExcludedSeniorEditor index={index} key={index} />
    ))}

    {values.opposedSeniorEditors.length < MAX_EXCLUDED_EDITORS && (
      <Box my={3}>
        Would you like to{' '}
        <MoreButton
          empty={{ name: '', reason: '' }}
          fieldName="opposedSeniorEditors"
          roleName="senior editor"
          setFieldValue={setFieldValue}
          type="exclude"
          values={values}
        />?
      </Box>
    )}

    {values.suggestedReviewingEditors
      .filter((_, index) => index % 2)
      .map((_, rowIndex) => (
        // eslint-disable-next-line react/no-array-index-key
        <SuggestedReviewingEditorRow key={rowIndex} rowIndex={rowIndex} />
      ))}

    {values.opposedReviewingEditors.map((_, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <ExcludedReviewingEditor index={index} key={index} />
    ))}

    <Box my={3}>
      Would you like to{' '}
      <MoreButton
        empty={['', '']}
        fieldName="suggestedReviewingEditors"
        more="more"
        roleName="reviewing editors"
        setFieldValue={setFieldValue}
        values={values}
      />{' '}
      or{' '}
      <MoreButton
        empty={{ name: '', reason: '' }}
        fieldName="opposedReviewingEditors"
        roleName="reviewing editor"
        setFieldValue={setFieldValue}
        type="exclude"
        values={values}
      />?
    </Box>

    {values.suggestedReviewers.map((_, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <SuggestedReviewer index={index} key={index} />
    ))}

    {values.opposedReviewers.map((_, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <ExcludedReviewer index={index} key={index} />
    ))}

    <Box my={3}>
      Would you like to{' '}
      <MoreButton
        empty=""
        fieldName="suggestedReviewers"
        roleName="reviewer"
        setFieldValue={setFieldValue}
        values={values}
      />{' '}
      or{' '}
      <MoreButton
        empty={{ name: '', email: '', reason: '' }}
        fieldName="opposedReviewers"
        roleName="reviewer"
        setFieldValue={setFieldValue}
        type="exclude"
        values={values}
      />?
    </Box>

    <Declaration />

    <Button primary type="submit">
      Next
    </Button>
    <ButtonLink to="/submit/metadata">Back</ButtonLink>
  </form>
)

export default ReviewerSuggestions
