import React from 'react'
import PropTypes from 'prop-types'

import TwoColumnLayout from '@elifesciences/component-elife-ui/client/global/layout/TwoColumnLayout'
import { peoplePropType } from './types'
import PersonPod from './PersonPod'
import Loading from '../atoms/Loading'

class PersonPodGrid extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      stillRendering: true,
      peopleLoaded: props.people && props.people.length > 0,
    }
  }

  componentDidMount() {
    setTimeout(() => this.setState({ stillRendering: false }), 10)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.people.length > 0) {
      this.setState({ peopleLoaded: true })
    }
  }

  render() {
    const {
      people,
      isSelected,
      toggleSelection,
      selection,
      maxSelection,
    } = this.props
    return this.state.stillRendering || !this.state.peopleLoaded ? (
      <Loading />
    ) : (
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
            maxSelection={maxSelection}
            name={person.name}
            selectButtonType={isSelected(person) ? 'selected' : 'add'}
            togglePersonSelection={() => toggleSelection(person)}
            // onKeywordClick will need to be added, once we know what the desired behaviour is
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
