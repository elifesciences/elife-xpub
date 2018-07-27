import React from 'react'
import { Box } from 'grid-styled'
import { Action, ErrorText } from '@pubsweet/ui'
import MoreButton from '../../../../ui/molecules/MoreButton'
import { FormH3 } from '../../../../ui/atoms/FormHeadings'

import {
  Declaration,
  ExcludedReviewer,
  SuggestedReviewer,
} from './FormSections'
import PeoplePickerControl from './PeoplePickerControl'
import Textarea from '../../../../ui/atoms/Textarea'
import CalloutBox from '../../../../ui/atoms/CalloutBox'
import ValidatedField from '../../../../ui/atoms/ValidatedField'
import { limits } from './schema'

const OptionalExclude = ({
  boxVisible,
  children,
  onRequestClose,
  onRequestOpen,
  roleName,
  ...props
}) =>
  boxVisible ? (
    <CalloutBox onClose={onRequestClose} {...props}>
      {children}
    </CalloutBox>
  ) : (
    <Box {...props}>
      Would you like to{' '}
      <Action onClick={onRequestOpen} type="button">
        exclude a {roleName}
      </Action>?
    </Box>
  )

const ValidationMessage = ({ message }) => (
  <div aria-live="polite">{message && <ErrorText>{message}</ErrorText>}</div>
)

class EditorsContent extends React.Component {
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
      errors,
      touched,
      values,
      setFieldValue,
      seniorEditors,
      reviewingEditors,
    } = this.props
    return (
      <React.Fragment>
        <Box mb={5}>
          <FormH3>Suggest Senior Editors</FormH3>

          <Box data-test-id="suggested-senior-editors" mb={2}>
            <PeoplePickerControl
              initialSelection={values.suggestedSeniorEditors}
              maxSelection={limits.suggestedSeniorEditors.max}
              minSelection={limits.suggestedSeniorEditors.min}
              modalOpen={this.isModalVisible('suggestedSeniorEditors')}
              onCancel={() => this.hideModal('suggestedSeniorEditors')}
              onRequestModal={() => this.showModal('suggestedSeniorEditors')}
              onRequestRemove={person =>
                this.removeSelection('suggestedSeniorEditors', person)
              }
              onSubmit={selection => {
                this.hideModal('suggestedSeniorEditors')
                setFieldValue('suggestedSeniorEditors', selection)
              }}
              options={seniorEditors}
            />
            <ValidationMessage
              message={
                touched.suggestedSeniorEditors && errors.suggestedSeniorEditors
              }
            />
          </Box>

          <OptionalExclude
            boxVisible={this.isBoxVisible('opposedSeniorEditors')}
            data-test-id="opposed-senior-editors"
            onRequestClose={() => this.hideBox('opposedSeniorEditors')}
            onRequestOpen={() => this.showBox('opposedSeniorEditors')}
            roleName="senior editor"
          >
            <FormH3>Exclude a Senior Editor</FormH3>

            <PeoplePickerControl
              initialSelection={values.opposedSeniorEditors}
              maxSelection={limits.opposedSeniorEditors.max}
              minSelection={limits.opposedSeniorEditors.min}
              modalOpen={this.isModalVisible('opposedSeniorEditors')}
              onCancel={() => this.hideModal('opposedSeniorEditors')}
              onRequestModal={() => this.showModal('opposedSeniorEditors')}
              onRequestRemove={person =>
                this.removeSelection('opposedSeniorEditors', person)
              }
              onSubmit={selection => {
                this.hideModal('opposedSeniorEditors')
                setFieldValue('opposedSeniorEditors', selection)
              }}
              options={seniorEditors}
            />

            <ValidationMessage
              message={
                touched.opposedSeniorEditors && errors.opposedSeniorEditors
              }
            />

            <ValidatedField
              component={Textarea}
              label="Reason for exclusion"
              name="opposedSeniorEditorsReason"
            />
          </OptionalExclude>
        </Box>

        <Box mb={5}>
          <FormH3>Suggest Reviewing Editors</FormH3>

          <Box data-test-id="suggested-reviewing-editors" mb={2}>
            <PeoplePickerControl
              initialSelection={values.suggestedReviewingEditors}
              maxSelection={limits.suggestedReviewingEditors.max}
              minSelection={limits.suggestedReviewingEditors.min}
              modalOpen={this.isModalVisible('suggestedReviewingEditors')}
              onCancel={() => this.hideModal('suggestedReviewingEditors')}
              onRequestModal={() => this.showModal('suggestedReviewingEditors')}
              onRequestRemove={person =>
                this.removeSelection('suggestedReviewingEditors', person)
              }
              onSubmit={selection => {
                this.hideModal('suggestedReviewingEditors')
                setFieldValue('suggestedReviewingEditors', selection)
              }}
              options={reviewingEditors}
            />

            <ValidationMessage
              message={
                touched.suggestedReviewingEditors &&
                errors.suggestedReviewingEditors
              }
            />
          </Box>

          <OptionalExclude
            boxVisible={this.isBoxVisible('opposedReviewingEditors')}
            data-test-id="opposed-reviewing-editors"
            onRequestClose={() => this.hideBox('opposedReviewingEditors')}
            onRequestOpen={() => this.showBox('opposedReviewingEditors')}
            roleName="reviewing editor"
          >
            <FormH3>Exclude a Reviewing Editor</FormH3>

            <PeoplePickerControl
              initialSelection={values.opposedReviewingEditors}
              maxSelection={limits.opposedReviewingEditors.max}
              minSelection={limits.opposedReviewingEditors.min}
              modalOpen={this.isModalVisible('opposedReviewingEditors')}
              onCancel={() => this.hideModal('opposedReviewingEditors')}
              onRequestModal={() => this.showModal('opposedReviewingEditors')}
              onRequestRemove={person =>
                this.removeSelection('opposedReviewingEditors', person)
              }
              onSubmit={selection => {
                this.hideModal('opposedReviewingEditors')
                setFieldValue('opposedReviewingEditors', selection)
              }}
              options={reviewingEditors}
            />

            <ValidationMessage
              message={
                touched.opposedReviewingEditors &&
                errors.opposedReviewingEditors
              }
            />

            <ValidatedField
              component={Textarea}
              label="Reason for exclusion"
              name="opposedReviewingEditorsReason"
            />
          </OptionalExclude>
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
  }
}

export default EditorsContent
