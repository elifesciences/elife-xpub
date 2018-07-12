import React from 'react'
import { Box } from 'grid-styled'
import MoreButton from '../../ui/molecules/MoreButton'

import {
  Declaration,
  ExcludedReviewer,
  ExcludedReviewingEditor,
  ExcludedSeniorEditor,
  SuggestedReviewer,
  SuggestedReviewingEditorRow,
  SuggestedSeniorEditorRow,
} from './FormSections'
import { FormH3 } from '../../../../ui/atoms/FormHeadings'

const MAX_EXCLUDED_EDITORS = 2

const ReviewerSuggestions = ({ values, setFieldValue }) => (
  <React.Fragment>
    <Box mb={5}>
      <FormH3>Suggest Senior Editors</FormH3>

      <Box mb={2}>
        <SuggestedSeniorEditorRow rowIndex={0} />
      </Box>

      {values.opposedSeniorEditors.map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Box key={index} mb={3}>
          <ExcludedSeniorEditor
            index={index}
            setFieldValue={setFieldValue}
            values={values}
          />
        </Box>
      ))}

      {values.opposedSeniorEditors.length < MAX_EXCLUDED_EDITORS && (
        <Box>
          Would you like to{' '}
          <MoreButton
            empty={{ name: '', reason: '' }}
            fieldName="opposedSeniorEditors"
            objectName="senior editor"
            setFieldValue={setFieldValue}
            type="exclude"
            values={values}
          />?
        </Box>
      )}
    </Box>

    <Box mb={5}>
      <FormH3>Suggest Reviewing Editors</FormH3>

      {values.suggestedReviewingEditors
        .filter((_, index) => index % 2)
        .map((_, rowIndex) => (
          // eslint-disable-next-line react/no-array-index-key
          <Box key={rowIndex} mb={2}>
            <SuggestedReviewingEditorRow rowIndex={rowIndex} />
          </Box>
        ))}

      {values.opposedReviewingEditors.map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Box key={index} mb={3}>
          <ExcludedReviewingEditor
            index={index}
            setFieldValue={setFieldValue}
            values={values}
          />
        </Box>
      ))}

      <Box>
        Would you like to{' '}
        <MoreButton
          empty={['', '']}
          fieldName="suggestedReviewingEditors"
          more="more"
          objectName="reviewing editors"
          setFieldValue={setFieldValue}
          values={values}
        />{' '}
        or{' '}
        <MoreButton
          empty={{ name: '', reason: '' }}
          fieldName="opposedReviewingEditors"
          objectName="reviewing editor"
          setFieldValue={setFieldValue}
          type="exclude"
          values={values}
        />?
      </Box>
    </Box>

    <Box mb={5}>
      <FormH3>Suggest Reviewers</FormH3>

      {values.suggestedReviewers.map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Box key={index} mb={2}>
          <SuggestedReviewer index={index} />
        </Box>
      ))}

      {values.opposedReviewers.map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Box key={index} my={3}>
          <ExcludedReviewer
            index={index}
            setFieldValue={setFieldValue}
            values={values}
          />
        </Box>
      ))}

      <Box>
        Would you like to{' '}
        <MoreButton
          empty=""
          fieldName="suggestedReviewers"
          objectName="reviewer"
          setFieldValue={setFieldValue}
          values={values}
        />{' '}
        or{' '}
        <MoreButton
          empty={{ name: '', email: '', reason: '' }}
          fieldName="opposedReviewers"
          objectName="reviewer"
          setFieldValue={setFieldValue}
          type="exclude"
          values={values}
        />?
      </Box>
    </Box>

    <Declaration />
  </React.Fragment>
)

export default ReviewerSuggestions
