import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Flex, Box } from 'grid-styled'
import { th } from '@pubsweet/ui-toolkit'
import { Button } from '@pubsweet/ui'

import ModalOverlay from './ModalOverlay'

const MiddleAligner = styled(Flex)`
  height: 100%;
`

const WhiteBox = styled(Box)`
  background-color: ${th('colorBackground')};
  text-align: center;
`

const ModalDialog = ({
  acceptText,
  cancelText,
  children,
  onAccept,
  onCancel,
  open,
  transparentBackground,
  ...props
}) => (
  <ModalOverlay
    open={open}
    transparentBackground={transparentBackground}
    {...props}
  >
    <MiddleAligner alignItems="center" justifyContent="center">
      <WhiteBox p={3}>
        {children}
        <Flex>
          <Box mr={3}>
            <Button onClick={onCancel}>{cancelText}</Button>
          </Box>
          <Box>
            <Button onClick={onAccept} primary>
              {acceptText}
            </Button>
          </Box>
        </Flex>
      </WhiteBox>
    </MiddleAligner>
  </ModalOverlay>
)

ModalDialog.propTypes = {
  acceptText: PropTypes.string.isRequired,
  cancelText: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onAccept: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  transparentBackground: PropTypes.bool.isRequired,
}

export default ModalDialog
