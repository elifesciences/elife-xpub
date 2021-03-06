import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

import Centerer from '@elifesciences/component-elife-ui/client/global/layout/Centerer'

const Root = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  border-top: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  background-color: ${th('colorBackground')};
`

const StickyFooter = ({
  children,
  pb = [18, 5, 5, 5],
  pt = [18, 3, 3, 3],
  ...props
}) => (
  <Root {...props}>
    <Centerer pb={pb} pt={pt}>
      {children}
    </Centerer>
  </Root>
)

export default StickyFooter
