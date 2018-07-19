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
      <ValidatedField label="Manuscript title" name="title" />
    </Box>

    <Box mb={3} w={1 / 2}>
      <ValidatedField
        component={Menu}
        label="Article type"
        name="manuscriptType"
        onBlur={value => setFieldValue('manuscriptType', value)}
        onChange={value => setFieldValue('manuscriptType', value)}
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
        name="subjectAreas"
        onBlur={e => setFieldTouched('subjectAreas', true)}
        onChange={selectedOptions => {
          const subjectAreas = selectedOptions.map(option => option.value)
          setFieldValue('subjectAreas', subjectAreas)
        }}
        savedValues={values.subjectAreas}
      />
    </Box>

    <OptionalSection
      label="This manuscript has been discussed with an eLife editor"
      onClose={() => setFieldValue('submissionMeta.discussion', null)}
      onOpen={() => setFieldValue('submissionMeta.discussion', '')}
      open={values.submissionMeta.discussion !== null}
    >
      <ValidatedField
        component={Textarea}
        label="What did you discuss and with whom?"
        name="submissionMeta.discussion"
      />
    </OptionalSection>

    <OptionalSection
      label="This manuscript has been previously considered by eLife"
      onClose={() => setFieldValue('submissionMeta.previousArticle', null)}
      onOpen={() => setFieldValue('submissionMeta.previousArticle', '')}
      open={values.submissionMeta.previousArticle !== null}
    >
      <ValidatedField
        label="Article title"
        name="submissionMeta.previousArticle"
      />
    </OptionalSection>

    <OptionalSection
      label="This manuscript is part of a co-submission"
      namedAs="cosubmission"
      onClose={() =>
        setFieldValue('submissionMeta.firstCosubmissionTitle', null)
      }
      onOpen={() => setFieldValue('submissionMeta.firstCosubmissionTitle', '')}
      open={values.submissionMeta.firstCosubmissionTitle !== null}
    >
      <Box mb={2}>
        <ValidatedField
          label="Second article title"
          name="submissionMeta.firstCosubmissionTitle"
        />
      </Box>

      {values.submissionMeta.secondCosubmissionTitle === null ? (
        // If null showing the link to show the second title...
        <Box>
          Would you like to{' '}
          <Action
            name="submissionMeta.moreSubmission"
            onClick={() =>
              setFieldValue('submissionMeta.secondCosubmissionTitle', '', false)
            }
            type="button"
          >
            include
          </Action>{' '}
          another cosubmission
        </Box>
      ) : (
        // the second title is not null so show it
        <Box mb={2}>
          <ValidatedField
            label="Third article title (optional)"
            name="submissionMeta.secondCosubmissionTitle"
          />
        </Box>
      )}
    </OptionalSection>
  </React.Fragment>
)

export default ManuscriptMetadata
