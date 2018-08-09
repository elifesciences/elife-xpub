import React from 'react'

import PersonPod from '../../../../ui/atoms/PersonPod'
import TwoColumnLayout from '../../../../global/layout/TwoColumnLayout'
import PeoplePickerModal from './PeoplePickerModal'

const PeoplePickerControl = ({
  maxSelection = Infinity,
  minSelection = 0,
  onRequestRemove,
  onRequestModal,
  initialSelection,
  onCancel,
  onSubmit,
  options,
  modalOpen,
  title,
}) => {
  const items = initialSelection.map(person => (
    <PersonPod
      iconType="remove"
      institution={person.aff}
      isKeywordClickable={false}
      key={person.id}
      keywords={person.subjectAreas}
      name={person.name}
      onIconClick={() => onRequestRemove(person)}
    />
  ))

  if (items.length < maxSelection)
    items.push(
      <PersonPod.SelectButton
        isRequired={items.length < minSelection}
        key="chooser"
        onIconClick={onRequestModal}
        roleName="Editor"
      />,
    )

  return (
    <React.Fragment>
      <TwoColumnLayout>{items}</TwoColumnLayout>
      <PeoplePickerModal
        initialSelection={initialSelection}
        maxSelection={maxSelection}
        minSelection={minSelection}
        onCancel={onCancel}
        onSubmit={onSubmit}
        open={modalOpen}
        people={options}
        title={title}
      />
    </React.Fragment>
  )
}

export default PeoplePickerControl
