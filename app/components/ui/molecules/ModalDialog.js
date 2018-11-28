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
  width: calc(${th('gridUnit')} * ${props => sizeToMultiple(props.size)});
  background-color: ${th('colorBackground')};
  text-align: center;
`

function sizeToMultiple(size) {
  switch (size) {
    case 'l':
      return 140
    case 'm':
      return 100
    default:
      return 68
  }
}

const ModalDialog = ({
  acceptText,
  cancelText,
  children,
  onAccept,
  onCancel,
  open,
  size,
  transparentBackground = true,
  attention,
  ...props
}) => (
  <ModalOverlay
    open={open}
    transparentBackground={transparentBackground}
    {...props}
  >
    <MiddleAligner alignItems="center" justifyContent="center">
      <WhiteBox p={3} size={size}>
        {children}
        <Flex justifyContent="center" mt={3}>
          <Box mr={3}>
            <Button data-test-id="cancel" onClick={onCancel} type="button">
              {cancelText}
            </Button>
          </Box>
          <Box>
            {attention && (
              <Button
                attention
                data-test-id="accept"
                onClick={onAccept}
                type="button"
              >
                {acceptText}
              </Button>
            )}
            {!attention && (
              <Button
                data-test-id="accept"
                onClick={onAccept}
                primary
                type="button"
              >
                {acceptText}
              </Button>
            )}
          </Box>
        </Flex>
      </WhiteBox>
    </MiddleAligner>
  </ModalOverlay>
)

ModalDialog.propTypes = {
  acceptText: PropTypes.string,
  cancelText: PropTypes.string,
  children: PropTypes.node.isRequired,
  onAccept: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  size: PropTypes.oneOf(['s', 'm', 'l']),
}

ModalDialog.defaultProps = {
  acceptText: 'OK',
  cancelText: 'Cancel',
  size: 's',
}

export default ModalDialog
