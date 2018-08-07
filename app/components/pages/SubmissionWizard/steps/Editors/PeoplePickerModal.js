import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import { Box, Flex } from 'grid-styled'

import Centerer from '../../../../global/layout/Centerer'
import ModalOverlay from '../../../../ui/molecules/ModalOverlay'
import PeoplePicker from '../../../../ui/molecules/PeoplePicker'
import SearchBox from '../../../../ui/molecules/SearchBox'

const ButtonBarContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  border-top: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  background-color: ${th('colorBackground')};
`

const MainColumn = styled(Box).attrs({ mx: [0, 0, 0, '16.666%'] })`
  flex: 1 1 auto;
  min-width: 0;
`

class PeoplePickerModal extends React.Component {
  state = {
    searchValue: '',
  }
  searchSubmit = searchValue => {
    this.setState({ searchValue })
  }
  render() {
    const { open, people, ...otherProps } = this.props
    const searchValue = this.state.searchValue.toLowerCase()
    const searchOptions = people.map(person => ({ value: person.name }))
    const filteredPeople = people.filter(person =>
      person.name.toLowerCase().includes(searchValue),
    )
    return (
      <ModalOverlay open={open}>
        <PeoplePicker people={filteredPeople} {...otherProps}>
          {innerProps => (
              <React.Fragment>
                <Centerer p={3}>
                  <Flex mx={-2}>
                    <Box
                      mx={[0, 0, 0, '16.666%']}
                      px={[2, 2, 2, 1]}
                      width={[1, 1, 1 / 2, 0.33]}
                    >
                      <SearchBox
                        onSubmit={this.searchSubmit}
                        options={searchOptions}
                      />
                    </Box>
                  </Flex>
                </Centerer>
                <Centerer p={3}>
                  <Flex data-test-id="people-picker-body">
                    <MainColumn mb={7}>
                      <PeoplePicker.Body {...innerProps} />
                    </MainColumn>
                  </Flex>
                </Centerer>
                <ButtonBarContainer>
                  <Centerer py={[3, 3, 3, 4]}>
                    <Flex>
                      <MainColumn>
                        <PeoplePicker.Buttons {...innerProps} />
                      </MainColumn>
                    </Flex>
                  </Centerer>
                </ButtonBarContainer>
              </React.Fragment>
            )}
        </PeoplePicker>
      </ModalOverlay>
    )
  }
}

export default PeoplePickerModal
