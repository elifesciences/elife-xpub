import { cloneDeep } from 'lodash'
import React from 'react'
import { compose } from 'recompose'
import { Box } from '@rebass/grid'
import { ErrorText } from '@pubsweet/ui'
import { FormH3 } from '@elifesciences/component-elife-ui/client/atoms/FormHeadings'
import {
  ActionText,
  Textarea,
  CalloutBox,
  ValidatedField,
} from '@elifesciences/component-elife-ui/client/atoms'

import PeoplePickerControl from '@elifesciences/component-submission/client/components/PeoplePicker/PeoplePickerControl'
import TwoColumnLayout from '@elifesciences/component-elife-ui/client/global/layout/TwoColumnLayout'
import { EDITOR_LIMITS } from '../utils/constants'
import editorsWithGQL from '../graphql/editorsWithGQL'

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
      <ActionText onClick={onRequestOpen} type="button">
        exclude a {roleName}
      </ActionText>
      ?
    </Box>
  )

const ValidationMessage = ({ message }) => (
  <div aria-live="polite">{message && <ErrorText>{message}</ErrorText>}</div>
)

export class EditorsStepPageComponent extends React.Component {
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

  suggestedReviewerItemIsBlank = item => item.name + item.email === ''

  getTrailingBlankReviewerCount = reviewers => {
    let blankRows = 0
    for (let index = reviewers.length - 1; index >= 0; index -= 1) {
      const item = reviewers[index]
      if (this.suggestedReviewerItemIsBlank(item)) {
        blankRows += 1
      } else {
        break
      }
    }
    return blankRows
  }

  calculateNewSuggestedReviewersFieldValue = (
    reviewers,
    maxOptions,
    minOptions,
  ) => {
    const newReviewers = cloneDeep(reviewers)

    const trailingBlankRows = this.getTrailingBlankReviewerCount(reviewers)
    if (trailingBlankRows === 0) {
      if (reviewers.length < maxOptions) {
        newReviewers.push({ name: '', email: '' })
      }
    } else if (trailingBlankRows > 1) {
      const rowsToRemove = trailingBlankRows - 1
      if (reviewers.length - rowsToRemove >= minOptions) {
        newReviewers.splice(newReviewers.length - rowsToRemove, rowsToRemove)
      }
    }

    return newReviewers
  }
  handleReviewersChanged = (fieldName, event) => {
    this.props.handleChange(event)
    // defer the execution of the function until the default change has been
    // handled so we're operating on the updated
    // "this.props.values.suggestedReviewers"
    this.setState({}, () => {
      const reviewers = this.props.values[fieldName]

      if (reviewers) {
        this.props.setFieldValue(
          fieldName,
          this.calculateNewSuggestedReviewersFieldValue(
            reviewers,
            EDITOR_LIMITS[fieldName].max,
            EDITOR_LIMITS[fieldName].min,
          ),
        )
      }
    })
  }

  filterEditors = (editors = [], toFilter) => {
    const toFilterIds = toFilter.map(item => item.id)
    return editors.filter(editor => toFilterIds.indexOf(editor.id) === -1)
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
              maxSelection={EDITOR_LIMITS.suggestedSeniorEditors.max}
              minSelection={EDITOR_LIMITS.suggestedSeniorEditors.min}
              modalName="suggestedSeniorEditors"
              modalTitle="Suggest Senior Editors"
              onRequestRemove={person =>
                this.removeSelection('suggestedSeniorEditors', person)
              }
              onSubmit={selection =>
                this.setSelection('suggestedSeniorEditors', selection)
              }
              people={this.filterEditors(
                seniorEditors.editors,
                values.opposedSeniorEditors,
              )}
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
              maxSelection={EDITOR_LIMITS.opposedSeniorEditors.max}
              minSelection={EDITOR_LIMITS.opposedSeniorEditors.min}
              modalName="opposedSeniorEditors"
              modalTitle="Exclude Senior Editors"
              onRequestRemove={person =>
                this.removeSelection('opposedSeniorEditors', person)
              }
              onSubmit={selection =>
                this.setSelection('opposedSeniorEditors', selection)
              }
              people={this.filterEditors(
                seniorEditors.editors,
                values.suggestedSeniorEditors,
              )}
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
              maxSelection={EDITOR_LIMITS.suggestedReviewingEditors.max}
              minSelection={EDITOR_LIMITS.suggestedReviewingEditors.min}
              modalName="suggestedReviewingEditors"
              modalTitle="Suggest Reviewing Editors"
              onRequestRemove={person =>
                this.removeSelection('suggestedReviewingEditors', person)
              }
              onSubmit={selection =>
                this.setSelection('suggestedReviewingEditors', selection)
              }
              people={this.filterEditors(
                reviewingEditors.editors,
                values.opposedReviewingEditors,
              )}
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
              maxSelection={EDITOR_LIMITS.opposedReviewingEditors.max}
              minSelection={EDITOR_LIMITS.opposedReviewingEditors.min}
              modalName="opposedReviewingEditors"
              modalTitle="Exclude Reviewing Editors"
              onRequestRemove={person =>
                this.removeSelection('opposedReviewingEditors', person)
              }
              onSubmit={selection =>
                this.setSelection('opposedReviewingEditors', selection)
              }
              people={this.filterEditors(
                reviewingEditors.editors,
                values.suggestedReviewingEditors,
              )}
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
          <FormH3>Suggest Reviewers (Optional)</FormH3>

          {values.suggestedReviewers.map((_, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Box data-test-id="suggestedReviewerInputGroup" key={index} mb={2}>
              <TwoColumnLayout bottomSpacing={false}>
                <ValidatedField
                  label={`Reviewer ${index + 1} name`}
                  name={`suggestedReviewers.${index}.name`}
                  onChange={event =>
                    this.handleReviewersChanged('suggestedReviewers', event)
                  }
                />
                <ValidatedField
                  label={`Reviewer ${index + 1} email`}
                  name={`suggestedReviewers.${index}.email`}
                  onChange={event =>
                    this.handleReviewersChanged('suggestedReviewers', event)
                  }
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
                onChange={event =>
                  this.handleReviewersChanged('opposedReviewers', event)
                }
              />
              <ValidatedField
                label="Excluded reviewer 1 email"
                name="opposedReviewers.0.email"
                onChange={event =>
                  this.handleReviewersChanged('opposedReviewers', event)
                }
                type="email"
              />
            </TwoColumnLayout>
            {values.opposedReviewers.map(
              (_, index) =>
                index > 0 && (
                  // eslint-disable-next-line react/no-array-index-key
                  <TwoColumnLayout bottomSpacing={false} key={index}>
                    <ValidatedField
                      label={`Excluded reviewer ${index + 1} name`}
                      name={`opposedReviewers.${index}.name`}
                      onChange={event =>
                        this.handleReviewersChanged('opposedReviewers', event)
                      }
                    />
                    <ValidatedField
                      label={`Excluded reviewer ${index + 1} email`}
                      name={`opposedReviewers.${index}.email`}
                      onChange={event =>
                        this.handleReviewersChanged('opposedReviewers', event)
                      }
                      type="email"
                    />
                  </TwoColumnLayout>
                ),
            )}
            <ValidatedField
              component={Textarea}
              label="Reason for exclusion"
              name="opposedReviewersReason"
            />
          </OptionalExclude>
        </Box>
      </React.Fragment>
    )
  }
}

export default compose(editorsWithGQL)(EditorsStepPageComponent)
