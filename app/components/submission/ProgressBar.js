import React from 'react'
import { Steps } from '@pubsweet/ui'
import { Box } from 'grid-styled'
import PropTypes from 'prop-types'

const ProgressBar = ({ currentStep }) => (
  <Box mx="auto" width={500}>
    <Steps currentStep={currentStep}>
      <Steps.Step />
      <Steps.Step />
      <Steps.Step />
      <Steps.Step />
    </Steps>
  </Box>
)

ProgressBar.propTypes = {
  currentStep: PropTypes.number.isRequired,
}

export default ProgressBar
