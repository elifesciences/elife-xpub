import React from 'react'
import styled from 'styled-components'
import { Button } from '@pubsweet/ui'
import { th } from '@pubsweet/ui-toolkit'
import { Box, Flex } from 'grid-styled'

import ModalOverlay from '../../../../ui/molecules/ModalOverlay'
import Centerer from '../../../../global/Centerer'

const ButtonBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  border-top: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
`

const PeoplePickerModal = ({ open, onRequestClose, onRequestAdd }) => (
  <ModalOverlay open={open}>
    <Centerer p={3}>
      <Flex>
        <Box flex="1 1 auto" mx={[0, 0, 0, '16.666%']}>
          People picker goes here
        </Box>
      </Flex>
    </Centerer>
    <ButtonBar>
      <Centerer px={2} py={4}>
        <Flex>
          <Box flex="1 1 auto" mx={[0, 0, 0, '16.666%']}>
            <Flex>
              <Box mx={2}>
                <Button onClick={onRequestClose}>Cancel</Button>
              </Box>
              <Box mx={2}>
                <Button disabled onClick={onRequestAdd} primary>
                  Add
                </Button>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Centerer>
    </ButtonBar>
  </ModalOverlay>
)

export default PeoplePickerModal
