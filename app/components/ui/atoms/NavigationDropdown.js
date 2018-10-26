import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Select from 'react-select'

// import NavLink from '../../ui/atoms/NavLink'

const Root = styled.div``

// const DropdownNavLink = styled(NavLink)`
//   display: block;
//   padding: ${th('space.1')};
// `

class NavigationDropdown extends React.Component {
  constructor(props) {
    super(props)
    const navItems = this.props.navList.map(navItem => navItem.label)
    this.state = {
      navItems,
      selected: navItems[0],
    }
  }

  handleChange(selected) {
    this.setState({ selected })
  }

  render() {
    const { navItems, selected } = this.state
    const selectProps = {
      value: selected,
      options: navItems,
      onChange: this.handleChange,
    }
    return (
      <Root>
        <Select {...selectProps} />
        {this.props.children}
      </Root>
    )
  }
}

NavigationDropdown.propTypes = {
  navList: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    }),
  ),
}

NavigationDropdown.defaultProps = {
  navList: [],
}

export default NavigationDropdown
