import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from '@rebass/grid'
import { Button } from '@pubsweet/ui'

const PeoplePickerButtons = ({ isValid = false, onCancel, onSubmit }) => (
  <Flex>
    <Box mr={3}>
      <Button onClick={onCancel}>Cancel</Button>
    </Box>
    <Box>
      <Button
        data-test-id="people-picker-add"
        disabled={!isValid}
        onClick={onSubmit}
        primary
      >
        Add
      </Button>
    </Box>
  </Flex>
)

PeoplePickerButtons.propTypes = {
  isValid: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

PeoplePickerButtons.defaultProps = {
  isValid: false,
}

export default PeoplePickerButtons
