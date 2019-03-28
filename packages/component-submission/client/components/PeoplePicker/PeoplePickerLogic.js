/* eslint-disable react/no-unused-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { escapeRegExp } from 'lodash'

import { peoplePropType } from './types'

class PeoplePickerLogic extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selection: this.props.initialSelection,
      searchValue: '',
    }
  }

  toggleSelection(person) {
    if (this.select(person)) {
      this.setState({
        selection: this.state.selection.filter(p => p.id !== person.id),
      })
    } else if (this.state.selection.length < this.props.maxSelection) {
      this.setState({ selection: this.state.selection.concat(person) })
    }
  }

  handleSubmit() {
    if (this.isValid()) {
      this.props.onSubmit(this.state.selection)
    }
  }

  select(person) {
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

    return people.filter(person =>
      person[field].toLowerCase().includes(inputValue),
    )
  }

  getMatchIndex = (inputValue, option) => {
    const re = new RegExp(escapeRegExp(inputValue))
    const match = re.exec(option.toLowerCase())
    if (match) return match.index
    return -1
  }

  render() {
    const { people, ...otherProps } = this.props
    let extendedPeople = [...people]

    extendedPeople = extendedPeople.map(person => ({
      ...person,
      searchValue: `${person.name} ${person.focuses.join(
        ' ',
      )} ${person.expertises.join(' ')} ${person.aff ? person.aff : ''}`,
    }))

    const searchOptions = extendedPeople.map(person => ({
      value: person.name,
    }))

    return this.props.children({
      ...otherProps,
      people: this.filterPeople(
        extendedPeople,
        this.state.searchValue,
        'searchValue',
      ),
      searchSubmit: this.searchSubmit,
      searchOptions,
      filterFunction: this.filterPeople,
      getMatchIndex: this.getMatchIndex,
      isSelected: person => this.select(person),
      isValid: this.isValid(),
      selection: this.state.selection,
      onSubmit: () => this.handleSubmit(),
      toggleSelection: person => this.toggleSelection(person),
    })
  }
}

PeoplePickerLogic.propTypes = {
  initialSelection: peoplePropType,
  minSelection: PropTypes.number,
  maxSelection: PropTypes.number,
  onSubmit: PropTypes.func.isRequired,
}

PeoplePickerLogic.defaultProps = {
  initialSelection: [],
  minSelection: 0,
  maxSelection: Infinity,
}

export default PeoplePickerLogic
