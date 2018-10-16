import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

import Centerer from '../../global/layout/Centerer'

const ButtonBarContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  border-top: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  background-color: ${th('colorBackground')};
`

const StickyFooter = ({ children, ...props }) => (
  <ButtonBarContainer {...props}>
    <Centerer pb={[18, 5, 5, 5]} pt={[18, 3, 3, 3]}>
      {children}
    </Centerer>
  </ButtonBarContainer>
)

export default StickyFooter
