import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import theme from '@elifesciences/elife-theme'
import ProfileMenu from './ProfileMenu'

const makeWrapper = props =>
  mount(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <div>
          <div id="outside" />
          <ProfileMenu
            user={{ identities: [{ name: 'A Person' }] }}
            {...props}
          />
        </div>
      </MemoryRouter>
    </ThemeProvider>,
  )

describe('ProfileMenu', () => {
  it('does not show profile button when not logged in', () => {
    const wrapper = makeWrapper({ user: null })
    expect(wrapper.find('button[data-test-id="profile-menu"]')).toHaveLength(0)
  })

  it('does not show menu by default', () => {
    const wrapper = makeWrapper()
    expect(wrapper.find('[data-test-id="logout"]')).toHaveLength(0)
    expect(wrapper.find('[data-test-id="manage-orcid"]')).toHaveLength(0)
  })

  it('shows menu on button click', () => {
    const wrapper = makeWrapper()
    wrapper.find('button[data-test-id="profile-menu"]').simulate('click')
    expect(wrapper.find('a[data-test-id="logout"]')).toHaveLength(1)
    expect(wrapper.find('a[data-test-id="manage-orcid"]')).toHaveLength(1)
  })

  it('hides menu on second button click', () => {
    const wrapper = makeWrapper()
    wrapper.find('button[data-test-id="profile-menu"]').simulate('click')
    expect(wrapper.find('a[data-test-id="logout"]')).toHaveLength(1)
    expect(wrapper.find('a[data-test-id="manage-orcid"]')).toHaveLength(1)
    wrapper.find('button[data-test-id="profile-menu"]').simulate('click')
    expect(wrapper.find('a[data-test-id="logout"]')).toHaveLength(0)
    expect(wrapper.find('a[data-test-id="manage-orcid"]')).toHaveLength(0)
  })

  it('hides menu on click outside of container', () => {
    // enzyme doesn't mount rendered fragments to the document
    // see https://github.com/airbnb/enzyme/issues/426
    let documentClickHandler
    jest
      .spyOn(document, 'addEventListener')
      .mockImplementationOnce((eventName, handler) => {
        documentClickHandler = handler
      })

    const wrapper = makeWrapper()

    wrapper.find('button[data-test-id="profile-menu"]').simulate('click')
    expect(wrapper.find('a[data-test-id="logout"]')).toHaveLength(1)
    expect(wrapper.find('a[data-test-id="manage-orcid"]')).toHaveLength(1)
    const div = wrapper.find('#outside').instance()
    documentClickHandler({ target: div })
    wrapper.update()
    expect(wrapper.find('a[data-test-id="logout"]')).toHaveLength(0)
    expect(wrapper.find('a[data-test-id="manage-orcid"]')).toHaveLength(0)
  })

  it('does exclude the name from the hotjar render', () => {
    const wrapper = makeWrapper()
    wrapper.find('button[data-test-id="profile-menu"]').simulate('click')
    expect(wrapper.find('div[data-hj-suppress=""]')).toHaveLength(1)
  })
})
