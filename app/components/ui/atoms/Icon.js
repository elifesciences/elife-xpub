import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import * as icons from './icons'

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  svg {
    stroke: ${props => props.color || props.theme.colorText};
    width: ${props => props.theme.space[props.size] || props.size};
    height: ${props => props.theme.space[props.size] || props.size};
  }
`

const Icon = ({ children, size, color, ...props }) => {
  const SelectedIcon = icons[children]
  if (!SelectedIcon) {
    console.warn("Icon '%s' not found", children)
    return ''
  }
  return (
    <Container color={color} role="img" size={size} {...props}>
      <SelectedIcon {...props} />
    </Container>
  )
}

Icon.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number.isRequired,
}

Icon.defaultProps = {
  color: 'black',
}

export default Icon
