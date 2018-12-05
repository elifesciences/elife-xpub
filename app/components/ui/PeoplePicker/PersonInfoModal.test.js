import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import theme from '@elifesciences/elife-theme'

import PersonInfoModal from './PersonInfoModal'

let handleAccept
let handleCancel

const person = {
  name: 'Joe Bloggs',
  institution: 'Best uni',
  focuses: ['first focus', 'second focus'],
  expertises: ['first expertise', 'second expertise'],
}

describe('PersonInfoModal', () => {
  beforeEach(() => {
    handleAccept = jest.fn()
    handleCancel = jest.fn()
  })
  
  it("renders button with 'Add editor' text, if person has already been selected", () => {
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <PersonInfoModal
          expertises={person.expertises}
          focuses={person.focuses}
          institution={person.institution}
          isSelected={false}
          name={person.name}
          onAccept={handleAccept}
          onCancel={handleCancel}
          open
        />
      </ThemeProvider>,
    )
    const buttonText = wrapper
      .find('[data-test-id="modal-dialog-accept"] button')
      .text()
    expect(buttonText).toEqual('Add editor')
  })

  it("renders button with 'Remove editor' text, if person has already been selected", () => {
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <PersonInfoModal
          expertises={person.expertises}
          focuses={person.focuses}
          institution={person.institution}
          isSelected
          name={person.name}
          onAccept={handleAccept}
          onCancel={handleCancel}
          open
        />
      </ThemeProvider>,
    )
    const buttonText = wrapper
      .find('[data-test-id="modal-dialog-accept"] button')
      .text()
    expect(buttonText).toEqual('Remove editor')
  })

  it('clicking accept button within the modal causes onAccept prop to fire', () => {
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <PersonInfoModal
          expertises={person.expertises}
          focuses={person.focuses}
          institution={person.institution}
          isSelected
          name={person.name}
          onAccept={handleAccept}
          onCancel={handleCancel}
          open
        />
      </ThemeProvider>,
    )
    const acceptButton = wrapper.find(
      '[data-test-id="modal-dialog-accept"] button',
    )
    acceptButton.simulate('click')
    expect(handleAccept).toHaveBeenCalled()
  })

  it('clicking cancel button within the modal causes onCancel prop to fire', () => {
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <PersonInfoModal
          expertises={person.expertises}
          focuses={person.focuses}
          institution={person.institution}
          isSelected
          name={person.name}
          onAccept={handleAccept}
          onCancel={handleCancel}
          open
        />
      </ThemeProvider>,
    )
    const cancelButton = wrapper.find(
      '[data-test-id="modal-dialog-cancel"] button',
    )
    cancelButton.simulate('click')
    expect(handleAccept).toHaveBeenCalled()
  })
})
