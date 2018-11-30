import React from 'react'
import PropTypes from 'prop-types'

import PersonPod from './PersonPod'
import ChooserPod from './ChooserPod'
import PeoplePickerLayout from './PeoplePickerLayout'
import ModalOverlay from '../molecules/ModalOverlay'
import TwoColumnLayout from '../../global/layout/TwoColumnLayout'
import ModalHistoryState from '../molecules/ModalHistoryState'

const PeoplePickerControl = ({
  maxSelection = Infinity,
  minSelection = 0,
  onRequestRemove,
  initialSelection,
  onSubmit,
  options,
  modalTitle,
  modalName,
}) => (
  <ModalHistoryState name={modalName}>
    {({ showModal, hideModal, isModalVisible }) => {
      const items = initialSelection.map(person => (
        <PersonPod
          expertises={person.expertises}
          focuses={person.focuses}
          institution={person.aff}
          isKeywordClickable={false}
          isSelected
          key={person.id}
          name={person.name}
          selectButtonType="remove"
          togglePersonSelection={() => onRequestRemove(person)}
        />
      ))

      if (items.length < maxSelection)
        items.push(
          <ChooserPod
            isRequired={items.length < minSelection}
            key="chooser"
            roleName="editor"
            togglePersonSelection={showModal}
          />,
        )

      return (
        <React.Fragment>
          <TwoColumnLayout>{items}</TwoColumnLayout>
          <ModalOverlay open={isModalVisible()} transparentBackground={false}>
            <PeoplePickerLayout
              initialSelection={initialSelection}
              maxSelection={maxSelection}
              minSelection={minSelection}
              modalTitle={modalTitle}
              onCancel={hideModal}
              onSubmit={(...args) => {
                hideModal()
                onSubmit(...args)
              }}
              people={options}
            />
          </ModalOverlay>
        </React.Fragment>
      )
    }}
  </ModalHistoryState>
)

const peopleArrayPropType = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
    aff: PropTypes.string,
    expertises: PropTypes.arrayOf(PropTypes.string.isRequired),
    focuses: PropTypes.arrayOf(PropTypes.string.isRequired),
  }),
)

PeoplePickerControl.propTypes = {
  maxSelection: PropTypes.number.isRequired,
  minSelection: PropTypes.number.isRequired,
  onRequestRemove: PropTypes.func.isRequired,
  initialSelection: peopleArrayPropType.isRequired,
  onSubmit: PropTypes.func.isRequired,
  options: peopleArrayPropType.isRequired,
  modalTitle: PropTypes.string.isRequired,
  modalName: PropTypes.string.isRequired,
}

export default PeoplePickerControl
