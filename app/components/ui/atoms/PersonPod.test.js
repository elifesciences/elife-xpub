import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import theme from '@elifesciences/elife-theme'

import PersonPod from './PersonPod'

const handleIconClick = jest.fn()
const handleKeywordClick = jest.fn()

function makePersonPodWrapper(props) {
  return mount(
    <ThemeProvider theme={theme}>
      <PersonPod {...props} />
    </ThemeProvider>,
  )
}

const propsWithClickableFunctionality = {
  iconState: 'add',
  institution: 'Utrecht University',
  isKeywordClickable: true,
  isStatusShown: false,
  keywords: 'cell biology',
  name: 'Richard Aldrich',
  onIconClick: handleIconClick,
  onKeywordClick: handleKeywordClick,
}

const propsWithDisabledKeywords = {
  ...propsWithClickableFunctionality,
  isKeywordClickable: false,
}

describe('PersonPod component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('onIconClick handler - fired when selection button is clicked', () => {
    const wrapper = makePersonPodWrapper(propsWithClickableFunctionality)
    const selectionButton = wrapper.find(
      'button[data-test-id="person-pod-button"]',
    )
    selectionButton.simulate('click')
    expect(handleIconClick.mock.calls).toHaveLength(1)
  })

  it('onKeywordClick handler - fired when selection button is clicked', () => {
    const wrapper = makePersonPodWrapper(propsWithClickableFunctionality)
    const keyword = wrapper.find('button[data-test-id="clickable-keyword"]')
    keyword.simulate('click')
    expect(handleKeywordClick.mock.calls).toHaveLength(1)
  })

  it('passing in isKeywordClickable = false - should render keywords that are not clickable', () => {
    const wrapper = makePersonPodWrapper(propsWithDisabledKeywords)
    expect(
      wrapper.find('button[data-test-id="clickable-keyword"]').exists(),
    ).toBe(false)
    const keywords = wrapper.find('p[data-test-id="non-clickable-keyword"]')
    expect(keywords.exists()).toBe(true)
    keywords.simulate('click')
    expect(handleKeywordClick.mock.calls).toHaveLength(0)
  })
})
