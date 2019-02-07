import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import { Box, Flex } from '@rebass/grid'

import media from 'global/layout/media'
import { peoplePropType } from './types'
import SelectedItem from '../atoms/SelectedItem'
import PersonPodGrid from './PersonPodGrid'

const SelectedItemsGrid = styled(Flex)`
  flex-wrap: wrap;
  align-items: center;
`

const SelectedContainer = styled(Flex).attrs({
  mb: [3, 3, 2, 2],
})`
  flex-direction: column;
  ${media.tabletPortraitUp`
    justify-content: space-between;
    flex-direction: row;
  `};
`

const SelectedItems = ({ selection, onCloseClick }) => (
  <SelectedItemsGrid>
    {selection.map(person => (
      <Box key={person.id} mr={1}>
        <SelectedItem
          label={person.name}
          onCloseClick={() => onCloseClick(person)}
        />
      </Box>
    ))}
  </SelectedItemsGrid>
)

const MessageWrapper = styled.div`
  ${media.tabletPortraitUp`
    position: absolute;
    top: -60px;
    right: 0;
  `};
`
const SuccessMessage = styled(MessageWrapper)`
  color: ${th('colorSuccess')};
`

const SelectionHint = ({ selection, minSelection, maxSelection }) => {
  const selectionLength = selection.length
  if (selectionLength < minSelection) {
    const numRequired = minSelection - selectionLength
    return (
      <MessageWrapper>
        {numRequired} more suggestion
        {numRequired === 1 ? '' : 's'} required
      </MessageWrapper>
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
  ...props
}) => (
  <React.Fragment>
    <SelectedContainer>
      <SelectedItems onCloseClick={toggleSelection} selection={selection} />
      <SelectionHint
        maxSelection={maxSelection}
        minSelection={minSelection}
        selection={selection}
      />
    </SelectedContainer>
    <PersonPodGrid
      isSelected={isSelected}
      maxSelection={maxSelection}
      people={people}
      selection={selection}
      toggleSelection={toggleSelection}
    />
  </React.Fragment>
)

SelectedItems.propTypes = {
  selection: peoplePropType.isRequired,
  onCloseClick: PropTypes.func.isRequired,
}

SelectionHint.propTypes = {
  selection: peoplePropType.isRequired,
  maxSelection: PropTypes.number.isRequired,
  minSelection: PropTypes.number.isRequired,
}

PeoplePickerBody.propTypes = {
  isSelected: PropTypes.func.isRequired,
  maxSelection: PropTypes.number.isRequired,
  minSelection: PropTypes.number.isRequired,
  people: peoplePropType.isRequired,
  selection: peoplePropType.isRequired,
  toggleSelection: PropTypes.func.isRequired,
}

export default PeoplePickerBody
