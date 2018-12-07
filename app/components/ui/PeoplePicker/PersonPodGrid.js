import React from 'react'
import PropTypes from 'prop-types'

import { peoplePropType } from './types'
import TwoColumnLayout from '../../global/layout/TwoColumnLayout'
import PersonPod from './PersonPod'

import { FixedSizeGrid as Grid } from 'react-window'

const PersonPodGrid = ({
  people,
  isSelected,
  toggleSelection,
  selection,
  maxSelection,
  ...props
}) => (
  <Grid
    columnCount={2}
    columnWidth=
  >
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
      ))}
  </TwoColumnLayout>
)

PersonPodGrid.propTypes = {
  people: peoplePropType.isRequired,
  isSelected: PropTypes.func.isRequired,
  toggleSelection: PropTypes.func.isRequired,
  selection: peoplePropType.isRequired,
  maxSelection: PropTypes.number,
}

PersonPodGrid.defaultProps = {
  maxSelection: Infinity,
}

export default PersonPodGrid
