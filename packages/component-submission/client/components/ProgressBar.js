import React from 'react'
import { Steps } from '@pubsweet/ui'
import { Box } from '@rebass/grid'
import PropTypes from 'prop-types'
import { STEP_NAMES } from '../utils/constants'

const ProgressBar = ({ currentStep }) => (
  <Box mx="auto" width={[1, 1, 500]}>
    <Steps currentStep={currentStep}>
      {Object.keys(STEP_NAMES).map(stepKey => (
        <Steps.Step key={stepKey} title={STEP_NAMES[stepKey]} />
      ))}
    </Steps>
  </Box>
)

ProgressBar.propTypes = {
  currentStep: PropTypes.number.isRequired,
}

export default ProgressBar
