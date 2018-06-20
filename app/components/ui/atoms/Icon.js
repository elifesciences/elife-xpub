import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { th } from '@pubsweet/ui'

import * as icons from './icons'

const Container = styled.span`
  display: inline-flex;
  padding: calc(${th('gridUnit')} / 2);
  svg {
    stroke: ${props => props.color || props.theme.colorText};
    width: calc(${props => props.size} * ${th('gridUnit')});
    height: calc(${props => props.size} * ${th('gridUnit')});
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
}

Icon.defaultProps = {
  color: 'black',
}

export default Icon
