import React from 'react'
import PropTypes from 'prop-types'
import { List, WindowScroller } from 'react-virtualized'

import { peoplePropType } from './types'
// import PersonPod from './PersonPod'

// const Pod = ({
//   person,
//   isSelected,
//   toggleSelection,
//   selection,
//   maxSelection,
// }) => (
//   <PersonPod
//     expertises={person.expertises}
//     focuses={person.focuses}
//     institution={person.aff}
//     isKeywordClickable={false}
//     isSelectButtonClickable={
//       isSelected(person) || selection.length < maxSelection
//     }
//     isSelected={isSelected(person)}
//     key={person.id}
//     name={person.name}
//     selectButtonType={isSelected(person) ? 'selected' : 'add'}
//     togglePersonSelection={() => toggleSelection(person)}
//   />
// )

class PersonPodGrid extends React.PuroComponent {
  constructor(props) {
    super(props)
    this.state = {}
    this.setRef = this.setRef.bind(this)
    this.toggleView = this.toggleView.bind(this)
  }

  rowRenderer = ({ index, key, style, parent }) => (
    <div key={key} style={style}>
      <p> {index} </p>
    </div>
  )

  setRef = ref => (this.windowScroller = ref)

  toggleView() {
    this.setState(
      {
        show: !this.state.show,
      },
      () => {
        this.windowScroller.updatePosition()
      },
    )
  }

  render() {
    return (
      <WindowScroller ref={this.setRef} scrollElement={window}>
        {({ height, scrollTop }) => (
          <div>
            <List
              autoHeight
              height={height}
              rowCount={1000}
              rowHeight={30}
              rowRenderer={this.rowRenderer}
              scrollTop={scrollTop}
              width={200}
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
