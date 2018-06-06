import React from 'react'
import _ from 'lodash'

import { H1, Menu, Checkbox, Button } from '@pubsweet/ui'
import { Field } from 'formik'

import ValidatedField from '../../ui/atoms/ValidatedField'
import CalloutBox from '../../ui/atoms/CalloutBox'
import ButtonLink from '../../ui/atoms/ButtonLink'
import Textarea from '../../ui/atoms/Textarea'
import ProgressBar from '../ProgressBar'

const CheckboxGeneratedChild = ({
  values,
  fieldName,
  checkboxStatus,
  checkboxLabel,
  children,
  ...props
}) => (
  <CalloutBox enabled={_.get(values, fieldName)}>
    <Field
      name={fieldName}
      render={({ field }) => (
        <Checkbox {...field} checked={field.value} label={checkboxLabel} />
      )}
    />
    {_.get(values, fieldName) && children}
  </CalloutBox>
)

class ManuscriptMetadata extends React.Component {
  constructor(props) {
    super(props)
    this.oldValues = _.cloneDeep(this.props.initialValues)
  }
  componentDidMount() {
    this.timer = setInterval(() => {
      if (this.props.storeFormData(this.oldValues, this.props.values)) {
        this.oldValues = _.cloneDeep(this.props.values)
      }
    }, this.props.updateInterval)
  }
  componentWillUnmount() {
    clearInterval(this.timer)
  }
  render() {
    return (
      <form noValidate onSubmit={this.props.handleSubmit}>
        <ProgressBar currentStep={2} />

        <H1>Help us get your work seen by the right people</H1>

        <ValidatedField label="Manuscript title" name="title" />
        <ValidatedField
          component={Menu}
          label="Article type"
          name="manuscriptType"
          onBlur={value => this.props.setFieldValue('manuscriptType', value)}
          onChange={value => this.props.setFieldValue('manuscriptType', value)}
          options={[
            { value: 'research-article', label: 'Research article' },
            { value: 'feature', label: 'Feature article' },
          ]}
        />

        <CheckboxGeneratedChild
          checkboxLabel="This manuscript has been discussed previously with an eLife editor"
          fieldName="submissionMeta.discussedPreviously"
          values={this.props.values}
        >
          <ValidatedField
            component={Textarea}
            label="What was discussed and with whom"
            name="submissionMeta.discussion"
          />
        </CheckboxGeneratedChild>

        <CheckboxGeneratedChild
          checkboxLabel="This manuscript has been considered by eLife previously"
          fieldName="submissionMeta.consideredPreviously"
          values={this.props.values}
        >
          <ValidatedField
            label="Article title/reference No"
            name="submissionMeta.previousArticle"
          />
        </CheckboxGeneratedChild>

        <CheckboxGeneratedChild
          checkboxLabel="This manuscript is a co-submission"
          fieldName="submissionMeta.cosubmission"
          values={this.props.values}
        >
          <div>
            <ValidatedField
              label="Article title"
              name="submissionMeta.cosubmissionTitle"
            />
            <ValidatedField
              label="Reference No"
              name="submissionMeta.cosubmissionId"
            />
          </div>
        </CheckboxGeneratedChild>

        <Button data-test-id="next" primary type="submit">
          Next
        </Button>
        <ButtonLink to="/submit/upload">Back</ButtonLink>
      </form>
    )
  }
}

export default ManuscriptMetadata
