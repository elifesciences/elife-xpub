import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { FixedSizeGrid as Grid } from 'react-window'
import memoize from 'memoize-one'

import { peoplePropType } from './types'
// import TwoColumnLayout from '../../global/layout/TwoColumnLayout'
import PersonPod from './PersonPod'

class Pod extends PureComponent {
  render() {
    const { data, style, columnIndex, rowIndex } = this.props
    const {
      people,
      isSelected,
      toggleSelection,
      selection,
      maxSelection,
    } = data
    const person = people[rowIndex * 2 + columnIndex]
    return person ? (
      <div style={style}>
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
        />
      </div>
    ) : null
  }
}

const PersonPodGrid = ({
  people,
  isSelected,
  toggleSelection,
  selection,
  maxSelection,
  ...props
}) => {
  const createItemData = memoize(
    (_people, _isSelected, _toggleSelection, _selection, _maxSelection) => ({
      people: _people,
      isSelected: _isSelected,
      toggleSelection: _toggleSelection,
      selection: _selection,
      maxSelection: _maxSelection,
    }),
  )

  const itemData = createItemData(
    people,
    isSelected,
    toggleSelection,
    selection,
    maxSelection,
  )
  return people.length > 0 ? (
    <Grid
      columnCount={2}
      columnWidth={400}
      height={1000}
      itemData={itemData}
      rowCount={Math.ceil(people.length / 2)}
      rowHeight={150}
      width={window.innerWidth}
    >
      {Pod}
    </Grid>
  ) : (
    'Loading...'
  )
}

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
