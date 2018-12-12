import React from 'react'
import PropTypes from 'prop-types'
import { List, WindowScroller } from 'react-virtualized'

import { peoplePropType } from './types'
import PersonPod from './PersonPod'

const Pod = ({
  person,
  isSelected,
  toggleSelection,
  selection,
  maxSelection,
}) => (
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
)

class PersonPodGrid extends React.Component {
  rowRenderer = ({ index, key, style }) => {
    const {
      people,
      isSelected,
      toggleSelection,
      selection,
      maxSelection,
    } = this.props
    return (
      <div key={key} style={style}>
        <Pod
          isSelected={isSelected}
          maxSelection={maxSelection}
          person={people[index]}
          selection={selection}
          toggleSelection={toggleSelection}
        />
      </div>
    )
  }

  render() {
    return (
      <WindowScroller
      // onScroll={() => console.log('Scrolled')}
      // ref={el => (this.ref = el)}
      // scrollElement={window}
      >
        {({ height, isScrolling, onChildScroll, scrollTop, registerChild }) => (
          <div ref={registerChild}>
            <List
              autoHeight
              height={height}
              isScrolling={isScrolling}
              onScroll={onChildScroll}
              overscanRowCount={2}
              rowCount={this.props.people.length}
              rowHeight={100}
              rowRenderer={this.rowRenderer}
              scrollTop={this.scrollY}
              width={500}
            />
          </div>
        )}
      </WindowScroller>
    )
  }
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
