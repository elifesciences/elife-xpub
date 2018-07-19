import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import { Box, Flex } from 'grid-styled'

import Centerer from '../../../../global/Centerer'
import ModalOverlay from '../../../../ui/molecules/ModalOverlay'
import PeoplePicker from '../../../../ui/molecules/PeoplePicker'

const ButtonBarContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  border-top: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
`

const PeoplePickerModal = ({ open, ...props }) => (
  <ModalOverlay open={open}>
    <PeoplePicker {...props}>
      {innerProps => (
        <React.Fragment>
          <Centerer p={3}>
            <Flex>
              <Box flex="1 1 auto" mx={[0, 0, 0, '16.666%']}>
                <PeoplePicker.Body {...innerProps} />
              </Box>
            </Flex>
          </Centerer>
          <ButtonBarContainer>
            <Centerer py={[3, 3, 3, 4]}>
              <Flex>
                <Box flex="1 1 auto" mx={[0, 0, 0, '16.666%']}>
                  <PeoplePicker.Buttons {...innerProps} />
                </Box>
              </Flex>
            </Centerer>
          </ButtonBarContainer>
        </React.Fragment>
      )}
    </PeoplePicker>
  </ModalOverlay>
)

export default PeoplePickerModal
