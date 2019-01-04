import React from 'react'
import { Steps } from '@pubsweet/ui'
import { Box } from '@rebass/grid'
import PropTypes from 'prop-types'

const ProgressBar = ({ currentStep }) => (
  <Box mx="auto" width={[1, 1, 500]}>
    <Steps currentStep={currentStep}>
      <Steps.Step title="Author" />
      <Steps.Step title="Files" />
      <Steps.Step title="Submission" />
      <Steps.Step title="Editors" />
      <Steps.Step title="Disclosure" />
    </Steps>
  </Box>
)

ProgressBar.propTypes = {
  currentStep: PropTypes.number.isRequired,
}

export default ProgressBar
