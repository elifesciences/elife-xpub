/* eslint-disable react/no-unused-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button } from '@pubsweet/ui'
import { th } from '@pubsweet/ui-toolkit'
import { Box, Flex } from 'grid-styled'
import { cloneDeep } from 'lodash'

import SelectedItem from '../atoms/SelectedItem'
import PersonPod from '../atoms/PersonPod'
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
        {numRequired} more suggestion{numRequired === 1 ? '' : 's'} required
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
  onCancel,
  onSubmit,
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
            iconType={isSelected(person) ? 'selected' : 'add'}
            institution={person.aff}
            isIconClickable={
              isSelected(person) || selection.length < maxSelection
            }
            isKeywordClickable={false}
            key={person.id}
            keywords={person.subjectAreas}
            name={person.name}
            onIconClick={() => toggleSelection(person)}
            // onKeywordClick will need to be added, once we know what the desired behaviour is
          />
        ))
        .slice(0, MAX_DISPLAYED_PODS)}
    </TwoColumnLayout>
  </React.Fragment>
)

const PeoplePickerButtons = ({ isValid, onCancel, onSubmit }) => (
  <Flex>
    <Box mr={3}>
      <Button onClick={onCancel}>Cancel</Button>
    </Box>
    <Box>
      <Button
        data-test-id="people-picker-add"
        disabled={!isValid}
        onClick={onSubmit}
        primary
      >
        Add
      </Button>
    </Box>
  </Flex>
)

class PeoplePicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selection: this.props.initialSelection,
      searchValue: '',
    }
  }

  toggleSelection(person) {
    if (this.isSelected(person)) {
      this.setState({
        selection: this.state.selection.filter(p => p.id !== person.id),
      })
    } else {
      this.setState({ selection: this.state.selection.concat(person) })
    }
  }

  handleSubmit() {
    if (this.isValid()) {
      this.props.onSubmit(this.state.selection)
    }
  }

  isSelected(person) {
    return this.state.selection.some(p => p.id === person.id)
  }

  isValid() {
    const selectionLength = this.state.selection.length
    return (
      selectionLength >= this.props.minSelection &&
      selectionLength <= this.props.maxSelection
    )
  }

  searchSubmit = searchValue => {
    this.setState({ searchValue })
  }

  filterPeople = (people, searchValue, field) => {
    if (!searchValue) return people

    const inputValue = searchValue.trim().toLowerCase()
    if (!inputValue) return people

    if (inputValue.split(' ').length > 1) {
      const matches = people.filter(person =>
        person[field].toLowerCase().includes(inputValue),
      )
      return matches.map(elem => {
        const clonedElem = cloneDeep(elem)
        clonedElem.matchIndex = elem[field].toLowerCase().indexOf(inputValue)
        return clonedElem
      })
    }
    return this.filterPeopleSingle(people, inputValue, field)
  }

  filterPeopleSingle = (people, inputValue, field) => {
    let maxWords = 0
    people.forEach(person => {
      const numWords = person[field].match(/[^ ]+/g).length
      if (numWords > maxWords) {
        maxWords = numWords
      }
    })

    let j
    let matches = []
    const matchIndex = []
    const re = new RegExp(`^${inputValue}`)

    const filterNthMatches = (person, n) => {
      const words = person[field].match(/[^ ]+/g)
      if (words.length <= n) {
        return false
      }
      const match = re.exec(words[n].toLowerCase())
      if (match) {
        matchIndex[j] = 0
        for (let k = 0; k < n; k += 1) {
          matchIndex[j] += words[k].length + 1
        }
        j += 1
        return true
      }
      return false
    }

    const addMatchIndex = person => {
      const clonedPerson = cloneDeep(person)
      clonedPerson.matchIndex = matchIndex[j]
      j += 1
      return clonedPerson
    }

    for (let i = 0; i < maxWords; i += 1) {
      /* matches for ith word */
      j = 0
      const ithMatches = people.filter(person => filterNthMatches(person, i))
      j = 0
      matches = matches.concat(ithMatches.map(addMatchIndex))
    }
    return matches
  }

  render() {
    const { people, ...otherProps } = this.props
    const sortedPeople = [...people].sort((a, b) =>
      a.name.localeCompare(b.name),
    )
    const searchOptions = sortedPeople.map(person => ({ value: person.name }))
    return this.props.children({
      ...otherProps,
      people: this.filterPeople(sortedPeople, this.state.searchValue, 'name'),
      searchSubmit: this.searchSubmit,
      searchOptions,
      filterFunction: this.filterPeople,
      isSelected: person => this.isSelected(person),
      isValid: this.isValid(),
      selection: this.state.selection,
      onSubmit: () => this.handleSubmit(),
      toggleSelection: person => this.toggleSelection(person),
    })
  }
}
const peopleArrayPropType = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
  }),
)

PeoplePicker.propTypes = {
  initialSelection: peopleArrayPropType,
  minSelection: PropTypes.number,
  maxSelection: PropTypes.number,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  people: peopleArrayPropType.isRequired,
}

PeoplePicker.defaultProps = {
  initialSelection: [],
  minSelection: 0,
  maxSelection: Infinity,
}

PeoplePicker.Body = PeoplePickerBody
PeoplePicker.Buttons = PeoplePickerButtons

export default PeoplePicker
