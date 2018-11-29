import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import { Box, Flex } from 'grid-styled'

import SelectedItem from '../atoms/SelectedItem'
import PersonPod from './PersonPod'
import TwoColumnLayout from '../../global/layout/TwoColumnLayout'

const MAX_DISPLAYED_PODS = 30

const SelectedItems = ({ selection, onCloseClick }) => (
  <Flex>
    {selection.map(person => (
      <Box key={person.id} mr={1}>
        <SelectedItem
          label={person.name}
          onCloseClick={() => onCloseClick(person)}
        />
      </Box>
    ))}
  </Flex>
)

const SuccessMessage = styled.div`
  color: ${th('colorSuccess')};
`

const SelectionHint = ({ selection, minSelection, maxSelection }) => {
  const selectionLength = selection.length
  if (selectionLength < minSelection) {
    const numRequired = minSelection - selectionLength
    return (
      <div>
        {numRequired} more suggestion
        {numRequired === 1 ? '' : 's'} required
      </div>
    )
  }
  if (selectionLength >= maxSelection) {
    return <SuccessMessage>Maximum {maxSelection} choices</SuccessMessage>
  }
  return null
}

const PeoplePickerBody = ({
  isSelected,
  maxSelection,
  minSelection,
  people,
  selection,
  toggleSelection,
}) => (
  <React.Fragment>
    <Flex justifyContent="space-between" mb={3}>
      <SelectedItems onCloseClick={toggleSelection} selection={selection} />
      <SelectionHint
        maxSelection={maxSelection}
        minSelection={minSelection}
        selection={selection}
      />
    </Flex>
    <TwoColumnLayout>
      {people
        .map(person => (
          <PersonPod
            expertises={person.expertises}
            focuses={person.focuses}
            institution={person.aff}
            isKeywordClickable={false}
            isSelectButtonClickable={
              isSelected(person) || selection.length < maxSelection
            }
            isSelected={isSelected(person)}
            key={person.id}
            name={person.name}
            selectButtonType={isSelected(person) ? 'selected' : 'add'}
            togglePersonSelection={() => toggleSelection(person)}
            // onKeywordClick will need to be added, once we know what the desired behaviour is
          />
        ))
        .slice(0, MAX_DISPLAYED_PODS)}
    </TwoColumnLayout>
  </React.Fragment>
)

const peopleArrayPropType = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
    aff: PropTypes.string.isRequired,
    expertises: PropTypes.arrayOf(PropTypes.string.isRequired),
    focuses: PropTypes.arrayOf(PropTypes.string.isRequired),
  }),
)

SelectedItems.propTypes = {
  selection: peopleArrayPropType.isRequired,
  onCloseClick: PropTypes.func.isRequired,
}

SelectionHint.propTypes = {
  selection: peopleArrayPropType.isRequired,
  maxSelection: PropTypes.number.isRequired,
  minSelection: PropTypes.number.isRequired,
}

PeoplePickerBody.propTypes = {
  isSelected: PropTypes.func.isRequired,
  maxSelection: PropTypes.number.isRequired,
  minSelection: PropTypes.number.isRequired,
  people: peopleArrayPropType.isRequired,
  selection: peopleArrayPropType.isRequired,
  toggleSelection: PropTypes.func.isRequired,
}

export default PeoplePickerBody
