import React from 'react'
import { Menu } from '@pubsweet/ui'
import { Box } from '@rebass/grid'
import {
  ValidatedField,
  ActionText,
  Textarea,
} from '@elifesciences/component-elife-ui/client/atoms'

import SubjectAreaDropdown from '../components/SubjectAreaDropdown'
import ExpandingTextField from '../components/ExpandingTextField'
import OptionalSection from '../components/OptionalSection'

const DetailsStep = ({
  values,
  setFieldValue,
  setFieldTouched,
  initialTitle,
}) => {
  if (initialTitle !== values.meta.title && values.meta.title === '') {
    setFieldValue('meta.title', initialTitle, false)
  }

  return (
    <React.Fragment>
      <Box mb={3}>
        <ValidatedField
          component={ExpandingTextField}
          data-test-id="manuscript-title-editor"
          label="Manuscript Title"
          maxRows={4}
          name="meta.title"
          placeholder="Manuscript Title"
        />
      </Box>

      <Box mb={3} width={[1, 1, 1 / 2, 1 / 2]}>
        <ValidatedField
          component={Menu}
          label="Article type"
          name="meta.articleType"
          onBlur={value => setFieldValue('meta.articleType', value)}
          onChange={value => setFieldValue('meta.articleType', value)}
          options={[
            { value: 'research-article', label: 'Research Article' },
            { value: 'short-report', label: 'Short Report' },
            { value: 'tools-resources', label: 'Tools and Resources' },
            {
              value: 'scientific-correspondence',
              label: 'Scientific Correspondence',
            },
            { value: 'feature', label: 'Feature Article' },
          ]}
          placeholder="Please choose"
        />
      </Box>

      <Box mb={3}>
        <ValidatedField
          component={SubjectAreaDropdown}
          isOptional={values.meta.articleType === 'feature'}
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
        value={values.previouslyDiscussed !== null}
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
        value={values.previouslySubmitted.length}
      >
        <ValidatedField
          component={Textarea}
          label="Please give details (including previous article title and tracking number)"
          name="previouslySubmitted.0"
        />
      </OptionalSection>

      <OptionalSection
        label="This manuscript is part of a co-submission to eLife"
        namedAs="cosubmissionToggle"
        onClose={() => setFieldValue('firstCosubmissionTitle', null)}
        onOpen={() => setFieldValue('firstCosubmissionTitle', '')}
        value={values.firstCosubmissionTitle !== null}
      >
        <Box mb={2}>
          <ValidatedField
            label="Co-submission article title"
            name="firstCosubmissionTitle"
          />
        </Box>

        {values.secondCosubmissionTitle === null ? (
          // If null showing the link to show the second title...
          <Box>
            Would you like to{' '}
            <ActionText
              name="moreSubmission"
              onClick={() =>
                setFieldValue('secondCosubmissionTitle', '', false)
              }
              type="button"
            >
              add details
            </ActionText>{' '}
            of another co-submission?
          </Box>
        ) : (
          // the second title is not null so show it
          <Box mb={2}>
            <ValidatedField
              label="Second co-submission article title (optional)"
              name="secondCosubmissionTitle"
            />
          </Box>
        )}
      </OptionalSection>
    </React.Fragment>
  )
}

export default DetailsStep
