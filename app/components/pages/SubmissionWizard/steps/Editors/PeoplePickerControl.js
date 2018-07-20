import React from 'react'

import PersonPod from '../../../../ui/atoms/PersonPod'
import TwoColumnLayout from '../../TwoColumnLayout'

const PeoplePickerControl = ({
  maxSelection = Infinity,
  minSelection = 0,
  onRequestRemove,
  onRequestModal,
  people,
}) => {
  const items = people.map(person => (
    <PersonPod
      iconType="remove"
      institution={person.institution}
      name={person.name}
      onIconClick={() => onRequestRemove(person)}
    />
  ))
  if (items.length < maxSelection)
    items.push(
      <PersonPod.SelectButton
        isRequired={items.length < minSelection}
        onIconClick={onRequestModal}
      />,
    )

  return <TwoColumnLayout items={items} mb={3} />
}

export default PeoplePickerControl
