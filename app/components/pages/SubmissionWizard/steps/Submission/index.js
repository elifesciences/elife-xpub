import React from 'react'
import { Menu, Action } from '@pubsweet/ui'
import { Box } from 'grid-styled'

import ValidatedField from '../../../../ui/atoms/ValidatedField'
import Textarea from '../../../../ui/atoms/Textarea'
import SubjectAreaDropdown from './SubjectAreaDropdown'
import OptionalSection from './OptionalSection'

const ManuscriptMetadata = ({ values, setFieldValue, setFieldTouched }) => (
  <React.Fragment>
    <Box mb={3}>
      <ValidatedField label="Manuscript title" name="meta.title" />
    </Box>

    <Box mb={3} w={1 / 2}>
      <ValidatedField
        component={Menu}
        label="Article type"
        name="meta.articleType"
        onBlur={value => setFieldValue('meta.articleType', value)}
        onChange={value => setFieldValue('meta.articleType', value)}
        options={[
          { value: 'research-article', label: 'Research article' },
          { value: 'feature', label: 'Feature article' },
        ]}
        placeholder="Please choose"
      />
    </Box>

    <Box mb={3}>
      <ValidatedField
        component={SubjectAreaDropdown}
        label="Subject areas"
        name="meta.subjects"
        onBlur={e => setFieldTouched('meta.subjects', true)}
        onChange={selectedOptions => {
          const subjects = selectedOptions.map(option => option.value)
          setFieldValue('meta.subjects', subjects)
        }}
        savedValues={values.meta.subjects}
      />
    </Box>

    <OptionalSection
      label="This manuscript has been discussed with an eLife editor"
      namedAs="previouslyDiscussedToggle"
      onClose={() => setFieldValue('previouslyDiscussed', null)}
      onOpen={() => setFieldValue('previouslyDiscussed', '')}
      open={values.previouslyDiscussed !== null}
    >
      <ValidatedField
        component={Textarea}
        label="What did you discuss and with whom?"
        name="previouslyDiscussed"
      />
    </OptionalSection>

    <OptionalSection
      label="This manuscript has been previously considered by eLife"
      namedAs="previouslySubmittedToggle"
      onClose={() => setFieldValue('previouslySubmitted', [])}
      onOpen={() => setFieldValue('previouslySubmitted', [''])}
      open={values.previouslySubmitted.length}
    >
      <ValidatedField label="Previous article title" name="previouslySubmitted.0" />
    </OptionalSection>

    <OptionalSection
      label="This manuscript is part of a co-submission"
      namedAs="cosubmissionToggle"
      onClose={() => setFieldValue('firstCosubmissionTitle', null)}
      onOpen={() => setFieldValue('firstCosubmissionTitle', '')}
      open={values.firstCosubmissionTitle !== null}
    >
      <Box mb={2}>
        <ValidatedField
          label="Title of co-submitted article"
          name="firstCosubmissionTitle"
        />
      </Box>

      {values.secondCosubmissionTitle === null ? (
        // If null showing the link to show the second title...
        <Box>
          Would you like to{' '}
          <Action
            name="moreSubmission"
            onClick={() => setFieldValue('secondCosubmissionTitle', '', false)}
            type="button"
          >
            add
          </Action>{' '}
          another co-submission
        </Box>
      ) : (
        // the second title is not null so show it
        <Box mb={2}>
          <ValidatedField
            label="Title of co-submitted article (optional)"
            name="secondCosubmissionTitle"
          />
        </Box>
      )}
    </OptionalSection>
  </React.Fragment>
)

export default ManuscriptMetadata
