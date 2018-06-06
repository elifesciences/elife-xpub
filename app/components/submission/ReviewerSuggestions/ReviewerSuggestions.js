import React from 'react'
import { Box } from 'grid-styled'
import { Button, H1, PlainButton } from '@pubsweet/ui'
import lodash from 'lodash'

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

class ReviewerSuggestions extends React.Component {
  constructor(props) {
    super(props)
    this.oldValues = lodash.cloneDeep(this.props.initialValues)
  }
  componentDidMount() {
    this.timer = setInterval(() => {
      if (this.props.storeFormData(this.oldValues, this.props.values)) {
        this.oldValues = lodash.cloneDeep(this.props.values)
      }
    }, this.props.updateInterval)
  }
  componentWillUnmount() {
    clearInterval(this.timer)
  }
  render() {
    return (
      <form noValidate onSubmit={this.props.handleSubmit}>
        <ProgressBar currentStep={3} />

        <H1>Who would you like to review your work?</H1>

        <SuggestedSeniorEditorRow rowIndex={0} />

        {this.props.values.opposedSeniorEditors.map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <ExcludedSeniorEditor index={index} key={index} />
        ))}

        {this.props.values.opposedSeniorEditors.length <
          MAX_EXCLUDED_EDITORS && (
          <Box my={3}>
            Would you like to{' '}
            <MoreButton
              empty={{ name: '', reason: '' }}
              fieldName="opposedSeniorEditors"
              roleName="senior editor"
              setFieldValue={this.props.setFieldValue}
              type="exclude"
              values={this.props.values}
            />?
          </Box>
        )}

        {this.props.values.suggestedReviewingEditors
          .filter((_, index) => index % 2)
          .map((_, rowIndex) => (
            // eslint-disable-next-line react/no-array-index-key
            <SuggestedReviewingEditorRow key={rowIndex} rowIndex={rowIndex} />
          ))}

        {this.props.values.opposedReviewingEditors.map((_, index) => (
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
            setFieldValue={this.props.setFieldValue}
            values={this.props.values}
          />{' '}
          or{' '}
          <MoreButton
            empty={{ name: '', reason: '' }}
            fieldName="opposedReviewingEditors"
            roleName="reviewing editor"
            setFieldValue={this.props.setFieldValue}
            type="exclude"
            values={this.props.values}
          />?
        </Box>

        {this.props.values.suggestedReviewers.map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <SuggestedReviewer index={index} key={index} />
        ))}

        {this.props.values.opposedReviewers.map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <ExcludedReviewer index={index} key={index} />
        ))}

        <Box my={3}>
          Would you like to{' '}
          <MoreButton
            empty=""
            fieldName="suggestedReviewers"
            roleName="reviewer"
            setFieldValue={this.props.setFieldValue}
            values={this.props.values}
          />{' '}
          or{' '}
          <MoreButton
            empty={{ name: '', email: '', reason: '' }}
            fieldName="opposedReviewers"
            roleName="reviewer"
            setFieldValue={this.props.setFieldValue}
            type="exclude"
            values={this.props.values}
          />?
        </Box>

        <Declaration />

        <Button data-test-id="next" primary type="submit">
          Submit
        </Button>
        <ButtonLink to="/submit/metadata">Back</ButtonLink>
      </form>
    )
  }
}

export default ReviewerSuggestions
