import React from 'react'
import PropTypes from 'prop-types'

import { peoplePropType } from './types'
import TwoColumnLayout from '../../global/layout/TwoColumnLayout'
import PersonPod from './PersonPod'

class PersonPodGrid extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      // peopleCurrentView: [],
    }
  }

  componentDidMount() {
    // onScroll event should be added to the wrapper modal or window
    window.addEventListener('scroll', this.handleScroll)
  }

  handleScroll = event => {
    // const {
    //   scrollY,
    //   visualViewport = { height, onscroll, pageTop, offsetTop },
    // } = window
    // use the window values to change the state of the peopleCurrentView
  }

  loadPeople = nextAmount => {
    this.setState({
      lastIndex: this.state.lastIndex + nextAmount,
    })
  }

  render() {
    const {
      isSelected,
      selection,
      maxSelection,
      toggleSelection,
      people,
    } = this.props

    return (
      <TwoColumnLayout>
        {people.map(person => (
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
        ))}
      </TwoColumnLayout>
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
