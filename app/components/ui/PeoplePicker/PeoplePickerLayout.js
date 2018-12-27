import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box, Flex } from '@rebass/grid'

import Centerer from '../../global/layout/Centerer'
import PeoplePickerLogic from './PeoplePickerLogic'
import PeoplePickerButtons from './PeoplePickerButtons'
import PeoplePickerBody from './PeoplePickerBody'
import SearchBox from './SearchBox'
import { FormH2 } from '../atoms/FormHeadings'
import StickyFooter from '../atoms/StickyFooter'

const MainColumn = styled(Box).attrs({ mx: [0, 0, 0, '16.666%'] })`
  flex: 1 1 auto;
  min-width: 0;
`

const PeoplePickerLayout = ({ modalTitle, ...props }) => (
  <PeoplePickerLogic {...props}>
    {innerProps => (
      <React.Fragment>
        <Centerer pt={3} px={3}>
          <Flex>
            <MainColumn>
              <FormH2>{modalTitle}</FormH2>
            </MainColumn>
          </Flex>
        </Centerer>
        <Centerer mb={3} px={3}>
          <Flex mx={-2}>
            <Box
              mx={[0, 0, 0, '16.666%']}
              px={[2, 2, 2, 1]}
              width={[1, 1, 1 / 2, 0.33]}
            >
              <SearchBox
                filterFunction={innerProps.filterFunction}
                getMatchIndex={innerProps.getMatchIndex}
                onSubmit={innerProps.searchSubmit}
                options={innerProps.searchOptions}
              />
            </Box>
          </Flex>
        </Centerer>
        <Centerer mb={3} px={3}>
          <Flex data-test-id="people-picker-body">
            <MainColumn mb={7}>
              <PeoplePickerBody {...innerProps} />
            </MainColumn>
          </Flex>
        </Centerer>
        <StickyFooter>
          <MainColumn>
            <PeoplePickerButtons {...innerProps} />
          </MainColumn>
        </StickyFooter>
      </React.Fragment>
    )}
  </PeoplePickerLogic>
)

PeoplePickerLayout.propTypes = {
  modalTitle: PropTypes.string.isRequired,
}

export default PeoplePickerLayout
