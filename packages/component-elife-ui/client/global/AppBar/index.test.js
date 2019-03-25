import React from 'react'
import { mount } from 'enzyme'
import { MockedProvider } from 'react-apollo/test-utils'
import { ThemeProvider } from 'styled-components'
import theme from '@elifesciences/elife-theme'
import { MemoryRouter } from 'react-router-dom'
// eslint-disable-next-line import/no-named-default
import { default as AppBarWrapper } from '.'
import { CURRENT_USER } from '../queries'
import AppBar from './AppBar'

const defaultProps = {
  defaultMenuItems: [
    { label: 'Author guide', link: '/author-guide' },
    { label: 'Reviewer guide', link: '/reviewer-guide' },
    { label: 'Contact us', link: '/contact-us' },
  ],
  userMenuItems: [{ label: 'Dashboard', link: '/' }],
}

const mockUserData = {
  data: {
    currentUser: {
      id: '111',
      identities: [
        {
          name: 'Joe Bloggs',
          email: '',
          aff: '',
          meta: {
            firstName: 'Joe',
            lastName: 'Bloggs',
            __typename: 'ElifeIdentityMeta',
          },
          __typename: 'ElifeIdentity',
        },
      ],
      __typename: 'User',
    },
  },
}

const currentUserMock = result => [
  {
    request: {
      query: CURRENT_USER,
    },
    result,
  },
]

const makeWrapper = (props, mocks = []) =>
  mount(
    <ThemeProvider theme={theme}>
      <MockedProvider addTypename mocks={mocks}>
        <MemoryRouter>
          <AppBarWrapper {...props} />
        </MemoryRouter>
      </MockedProvider>
    </ThemeProvider>,
  )

describe('AppBarWrapper', () => {
  it('Only receives default menu links when no user object passed', async () => {
    const wrapper = makeWrapper(defaultProps, currentUserMock({}))
    await new Promise(resolve => {
      setTimeout(resolve, 0)
    })
    wrapper.update()
    expect(wrapper.find(AppBar).props().menuItems).toHaveLength(
      defaultProps.defaultMenuItems.length,
    )
  })

  it('Receives both default and user menu items when user object passed', async () => {
    const wrapper = makeWrapper(defaultProps, currentUserMock(mockUserData))

    await new Promise(resolve => {
      setTimeout(resolve, 0)
    })
    wrapper.update()
    expect(wrapper.find(AppBar).props().menuItems).toHaveLength(
      defaultProps.defaultMenuItems.length + defaultProps.userMenuItems.length,
    )
  })
})
