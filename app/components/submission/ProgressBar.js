import React from 'react'
import { Steps } from '@pubsweet/ui'
import { Box } from 'grid-styled'
import PropTypes from 'prop-types'

const ProgressBar = ({ currentStep }) => (
  <Box mx="auto" width={500}>
    <Steps currentStep={currentStep}>
      <Steps.Step title="Step 1" />
      <Steps.Step title="Step 2" />
      <Steps.Step title="Step 3" />
      <Steps.Step title="Step 4" />
    </Steps>
  </Box>
)

ProgressBar.propTypes = {
  currentStep: PropTypes.number.isRequired,
}

export default ProgressBar
