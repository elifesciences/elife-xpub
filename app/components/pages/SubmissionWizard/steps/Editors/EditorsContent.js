import React from 'react'
import { Box } from 'grid-styled'
import MoreButton from '../../../../ui/molecules/MoreButton'
import { FormH3 } from '../../../../ui/atoms/FormHeadings'

import {
  Declaration,
  ExcludedReviewer,
  SuggestedReviewer,
} from './FormSections'
import EditorSection from './EditorSection'

const minimax = {
  suggestedSeniorEditors: { min: 2, max: 2 },
  opposedSeniorEditors: { min: 0, max: 2 },
  suggestedReviewingEditors: { min: 2, max: 2 },
  opposedReviewingEditors: { min: 0, max: 2 },
}

class ReviewerSuggestions extends React.Component {
  state = {
    boxVisibility: {},
    modalVisibility: {},
  }

  showBox = name => {
    this.setState({
      boxVisibility: { ...this.state.boxVisibility, [name]: true },
    })
  }

  hideBox = name => {
    this.setState({
      boxVisibility: { ...this.state.boxVisibility, [name]: false },
    })
    this.props.setFieldValue(name, [])
  }

  showModal = name => {
    this.setState({ modalVisibility: { [name]: true } })
  }

  hideModal = name => {
    this.setState({ modalVisibility: { [name]: false } })
  }

  isBoxVisible = name => this.state.boxVisibility[name]

  isModalVisible = name => !!this.state.modalVisibility[name]

  removeSelection = (name, person) => {
    this.props.setFieldValue(
      name,
      this.props.values[name].filter(p => p.id !== person.id),
    )
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      boxVisibility: {
        opposedSeniorEditors:
          !!nextProps.values.opposedSeniorEditors.length ||
          prevState.boxVisibility.opposedSeniorEditors,
        opposedReviewingEditors:
          !!nextProps.values.opposedReviewingEditors.length ||
          prevState.boxVisibility.opposedReviewingEditors,
      },
    }
  }

  render() {
    const {
      values,
      setFieldValue,
      seniorEditors,
      reviewingEditors,
    } = this.props
    return (
      <React.Fragment>
        <EditorSection
          hideBox={this.hideBox}
          hideModal={this.hideModal}
          isBoxVisible={this.isBoxVisible}
          isModalVisible={this.isModalVisible}
          minimax={minimax}
          opposedKey="opposedSeniorEditors"
          people={seniorEditors}
          removeSelection={this.removeSelection}
          roleName="senior editor"
          showBox={this.showBox}
          showModal={this.showModal}
          suggestedKey="suggestedSeniorEditors"
          updateSelection={setFieldValue}
          values={values}
        />

        <EditorSection
          hideBox={this.hideBox}
          hideModal={this.hideModal}
          isBoxVisible={this.isBoxVisible}
          isModalVisible={this.isModalVisible}
          minimax={minimax}
          opposedKey="opposedReviewingEditors"
          people={reviewingEditors}
          removeSelection={this.removeSelection}
          roleName="reviewing editor"
          showBox={this.showBox}
          showModal={this.showModal}
          suggestedKey="suggestedReviewingEditors"
          updateSelection={setFieldValue}
          values={values}
        />

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
  }
}

export default ReviewerSuggestions
