import React from 'react'
import { Box } from 'grid-styled'
import { Action } from '@pubsweet/ui'
import { FormH3 } from '../../../../ui/atoms/FormHeadings'
import PeoplePickerModal from './PeoplePickerModal'
import PeoplePickerControl from './PeoplePickerControl'
import Textarea from '../../../../ui/atoms/Textarea'
import CalloutBox from '../../../../ui/atoms/CalloutBox'
import ValidatedField from '../../../../ui/atoms/ValidatedField'

const EditorSection = ({
  values,
  people,
  suggestedKey,
  opposedKey,
  minimax,
  roleName,
  showBox,
  hideBox,
  showModal,
  hideModal,
  isBoxVisible,
  isModalVisible,
  removeSelection,
  updateSelection,
}) => (
  <Box mb={5}>
    <FormH3>Suggest {roleName}s</FormH3>

    <Box mb={2}>
      <PeoplePickerControl
        maxSelection={minimax[suggestedKey].max}
        minSelection={minimax[suggestedKey].min}
        onRequestModal={() => showModal(suggestedKey)}
        onRequestRemove={person => removeSelection(suggestedKey, person)}
        people={values[suggestedKey]}
      />
      <PeoplePickerModal
        initialSelection={values[suggestedKey]}
        maxSelection={minimax[suggestedKey].max}
        minSelection={minimax[suggestedKey].min}
        onCancel={() => hideModal(suggestedKey)}
        onRequestClose={() => hideModal(suggestedKey)}
        onSubmit={selection => {
          hideModal(suggestedKey)
          updateSelection(suggestedKey, selection)
        }}
        open={isModalVisible(suggestedKey)}
        people={people}
      />
    </Box>

    {isBoxVisible(opposedKey) ? (
      <CalloutBox onClose={() => hideBox(opposedKey)}>
        <FormH3>Exclude a {roleName}</FormH3>

        <PeoplePickerControl
          maxSelection={minimax[opposedKey].max}
          mb={3}
          minSelection={minimax[opposedKey].min}
          onRequestModal={() => showModal(opposedKey)}
          onRequestRemove={person => removeSelection(opposedKey, person)}
          people={values[opposedKey]}
        />
        <PeoplePickerModal
          initialSelection={values[opposedKey]}
          maxSelection={minimax[opposedKey].max}
          minSelection={minimax[opposedKey].min}
          onCancel={() => hideModal(opposedKey)}
          onRequestClose={() => hideModal(opposedKey)}
          onSubmit={selection => {
            hideModal(opposedKey)
            updateSelection(opposedKey, selection)
          }}
          open={isModalVisible(opposedKey)}
          people={people}
        />

        <ValidatedField
          component={Textarea}
          label="Reason for exclusion"
          name={`${opposedKey}Reason`}
        />
      </CalloutBox>
    ) : (
      <Box>
        Would you like to{' '}
        <Action onClick={() => showBox(opposedKey)} type="button">
          exclude a {roleName}
        </Action>?
      </Box>
    )}
  </Box>
)

export default EditorSection
