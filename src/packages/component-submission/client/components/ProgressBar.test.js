import React from 'react'
import { mount } from 'enzyme'
import ProgressBar from './ProgressBar'
import { STEP_NAMES } from '../utils/constants'

describe('ProgressBar', () => {
  it('Contains a step for each of the values in STEP_NAMES', () => {
    const wrapper = mount(<ProgressBar currentStep={1} />)
    const renderedText = wrapper.text()

    Object.keys(STEP_NAMES).forEach(stepKey => {
      expect(renderedText).toContain(STEP_NAMES[stepKey])
    })
  })
})
