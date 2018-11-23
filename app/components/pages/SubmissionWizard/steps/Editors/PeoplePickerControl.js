import React from 'react'

import PersonPod from '../../../../ui/atoms/PersonPod'
import TwoColumnLayout from '../../../../global/layout/TwoColumnLayout'
import PeoplePickerModal from './PeoplePickerModal'
import ModalHistoryState from '../../../../ui/molecules/ModalHistoryState'

const PeoplePickerControl = ({
  maxSelection = Infinity,
  minSelection = 0,
  onRequestRemove,
  onRequestModal,
  initialSelection,
  onSubmit,
  options,
  title,
}) => (
  <ModalHistoryState name={title}>
    {({ showModal, hideModal, isModalVisible }) => {
      const items = initialSelection.map(person => (
        <PersonPod
          iconType="remove"
          institution={person.aff}
          isKeywordClickable={false}
          key={person.id}
          keywords={[].concat(person.focuses).concat(person.expertises)}
          name={person.name}
          onIconClick={() => onRequestRemove(person)}
        />
      ))

      if (items.length < maxSelection)
        items.push(
          <PersonPod.SelectButton
            isRequired={items.length < minSelection}
            key="chooser"
            onIconClick={showModal}
            roleName="editor"
          />,
        )

      return (
        <React.Fragment>
          <TwoColumnLayout>{items}</TwoColumnLayout>
          <PeoplePickerModal
            initialSelection={initialSelection}
            maxSelection={maxSelection}
            minSelection={minSelection}
            onCancel={hideModal}
            onSubmit={(...args) => {
              hideModal()
              onSubmit(...args)
            }}
            open={isModalVisible()}
            people={options}
            title={title}
          />
        </React.Fragment>
      )
    }}
  </ModalHistoryState>
)

export default PeoplePickerControl
