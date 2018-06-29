import React from 'react'
import { Box } from 'grid-styled'
import { Button, Action } from '@pubsweet/ui'

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
import { FormH2, FormH3 } from '../../ui/atoms/FormHeadings'

const MoreButton = ({
  empty,
  fieldName,
  roleName,
  setFieldValue,
  type = 'suggest',
  more = 'another',
  values,
}) => (
  <Action
    onClick={() =>
      setFieldValue(fieldName, values[fieldName].concat(empty), false)
    }
    type="button"
  >
    {type} {values[fieldName].length ? more : 'a'} {roleName}
  </Action>
)

const MAX_EXCLUDED_EDITORS = 2

const ReviewerSuggestions = ({ handleSubmit, values, setFieldValue }) => (
  <form noValidate onSubmit={handleSubmit}>
    <ProgressBar currentStep={3} />

    <FormH2>Who should review your work?</FormH2>

    <FormH3>Suggest a Senior Editor</FormH3>

    <SuggestedSeniorEditorRow rowIndex={0} />

    {values.opposedSeniorEditors.map((_, index) => (
      <ExcludedSeniorEditor
        index={index}
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        setFieldValue={setFieldValue}
        values={values}
      />
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

    <FormH3>Suggest a Reviewing Editor</FormH3>

    {values.suggestedReviewingEditors
      .filter((_, index) => index % 2)
      .map((_, rowIndex) => (
        // eslint-disable-next-line react/no-array-index-key
        <SuggestedReviewingEditorRow key={rowIndex} rowIndex={rowIndex} />
      ))}

    {values.opposedReviewingEditors.map((_, index) => (
      <ExcludedReviewingEditor
        index={index}
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        setFieldValue={setFieldValue}
        values={values}
      />
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
      <ExcludedReviewer
        index={index}
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        setFieldValue={setFieldValue}
        values={values}
      />
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

    <Button data-test-id="next" primary type="submit">
      Submit
    </Button>
    <ButtonLink to="/submit/metadata">Back</ButtonLink>
  </form>
)

export default ReviewerSuggestions
