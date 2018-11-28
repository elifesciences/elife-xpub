import { cloneDeep } from 'lodash'
import React from 'react'
import { Box } from 'grid-styled'
import { Action, ErrorText } from '@pubsweet/ui'
import { FormH3 } from '../../../../ui/atoms/FormHeadings'

import PeoplePickerControl from '../../../../ui/PeoplePicker/PeoplePickerControl'
import Textarea from '../../../../ui/atoms/Textarea'
import CalloutBox from '../../../../ui/atoms/CalloutBox'
import ValidatedField from '../../../../ui/atoms/ValidatedField'
import ControlledCheckbox from '../../../../ui/atoms/ControlledCheckbox'
import TwoColumnLayout from '../../../../global/layout/TwoColumnLayout'
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
      </Action>
      ?
    </Box>
  )

const ValidationMessage = ({ message }) => (
  <div aria-live="polite">{message && <ErrorText>{message}</ErrorText>}</div>
)

class EditorsPage extends React.Component {
  state = {
    boxVisibility: {},
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
        opposedReviewers:
          !!nextProps.values.opposedReviewers.length ||
          prevState.boxVisibility.opposedReviewers,
      },
    }
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

  isBoxVisible = name => this.state.boxVisibility[name]

  setSelection = (name, selection) => {
    this.props.setFieldValue(name, selection)
    this.props.setFieldTouched(name, true)
  }

  removeSelection = (name, person) => {
    const value = this.props.values[name].filter(p => p.id !== person.id)
    this.props.setFieldValue(name, value)
    this.props.setFieldTouched(name, true)
  }

  handleSuggestedReviewersChanged = event => {
    this.props.handleChange(event)

    const MAX_REVIEWERS = limits.suggestedReviewers.max
    const MIN_REVIEWERS = limits.suggestedReviewers.min

    const itemIsBlank = item => item.name + item.email === ''

    // defer the execution of the function until the default change has been
    // handled so we're operating on the updated
    // "this.props.values.suggestedReviewers"
    this.setState({}, () => {
      const reviewers = this.props.values.suggestedReviewers

      // logic only kicks in for the optional reviewers
      if (reviewers) {
        // first count the blanks at the end
        let numBlanks = 0
        for (let index = reviewers.length - 1; index > 0; index -= 1) {
          const item = reviewers[index]
          if (itemIsBlank(item)) {
            numBlanks += 1
          } else {
            break
          }
        }

        // if we have no blanks then add if one if less than max
        if (numBlanks === 0) {
          if (reviewers.length < MAX_REVIEWERS) {
            const newReviewers = cloneDeep(reviewers)
            newReviewers.push({ name: '', email: '' })
            this.props.setFieldValue('suggestedReviewers', newReviewers)
          }
        } else if (numBlanks > 1) {
          const numToGo = numBlanks - 1
          if (reviewers.length - numToGo >= MIN_REVIEWERS) {
            // we have more than one blank line so tidy up
            const newReviewers = cloneDeep(reviewers)
            newReviewers.splice(newReviewers.length - numToGo, numToGo)
            this.props.setFieldValue('suggestedReviewers', newReviewers)
          }
        }
      }
    })
  }

  render() {
    const {
      errors,
      touched,
      values,
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
              onRequestRemove={person =>
                this.removeSelection('suggestedSeniorEditors', person)
              }
              onSubmit={selection =>
                this.setSelection('suggestedSeniorEditors', selection)
              }
              options={seniorEditors}
              title="senior editors"
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
              onRequestRemove={person =>
                this.removeSelection('opposedSeniorEditors', person)
              }
              onSubmit={selection =>
                this.setSelection('opposedSeniorEditors', selection)
              }
              options={seniorEditors}
              title="senior editors"
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
              onRequestRemove={person =>
                this.removeSelection('suggestedReviewingEditors', person)
              }
              onSubmit={selection =>
                this.setSelection('suggestedReviewingEditors', selection)
              }
              options={reviewingEditors}
              title="reviewing editors"
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
              onRequestRemove={person =>
                this.removeSelection('opposedReviewingEditors', person)
              }
              onSubmit={selection =>
                this.setSelection('opposedReviewingEditors', selection)
              }
              options={reviewingEditors}
              title="Reviewing Editors"
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
              <TwoColumnLayout bottomSpacing={false}>
                <ValidatedField
                  label={
                    index < limits.suggestedReviewers.min
                      ? `Reviewer ${index + 1} name`
                      : `Reviewer ${index + 1} name (optional)`
                  }
                  name={`suggestedReviewers.${index}.name`}
                  onChange={this.handleSuggestedReviewersChanged}
                />
                <ValidatedField
                  label={
                    index < limits.suggestedReviewers.min
                      ? `Reviewer ${index + 1} email`
                      : `Reviewer ${index + 1} email (optional)`
                  }
                  name={`suggestedReviewers.${index}.email`}
                  onChange={this.handleSuggestedReviewersChanged}
                  type="email"
                />
              </TwoColumnLayout>
            </Box>
          ))}

          <OptionalExclude
            boxVisible={this.isBoxVisible('opposedReviewers')}
            data-test-id="opposed-reviewers"
            onRequestClose={() => this.hideBox('opposedReviewers')}
            onRequestOpen={() => this.showBox('opposedReviewers')}
            roleName="reviewer"
          >
            <FormH3>Exclude Reviewers</FormH3>

            <TwoColumnLayout bottomSpacing={false}>
              <ValidatedField
                label="Excluded reviewer 1 name"
                name="opposedReviewers.0.name"
              />
              <ValidatedField
                label="Excluded reviewer 1 email"
                name="opposedReviewers.0.email"
                type="email"
              />
            </TwoColumnLayout>
            <TwoColumnLayout bottomSpacing={false}>
              <ValidatedField
                label="Excluded reviewer 2 name"
                name="opposedReviewers.1.name"
              />
              <ValidatedField
                label="Excluded reviewer 2 email"
                name="opposedReviewers.1.email"
                type="email"
              />
            </TwoColumnLayout>

            <ValidatedField
              component={Textarea}
              label="Reason for exclusion"
              name="opposedReviewersReason"
            />
          </OptionalExclude>
        </Box>

        <ValidatedField
          component={ControlledCheckbox}
          label="I declare that, to the best of my knowledge, these experts have no conflict of interest"
          name="suggestionsConflict"
        />
      </React.Fragment>
    )
  }
}

export default EditorsPage
