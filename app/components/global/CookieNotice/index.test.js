import React from 'react'
import { shallow } from 'enzyme'
import CookieNotice from '.'

describe('CookieNotice', () => {
  it('does not display if has been previously accepted', () => {
    const document = {
      cookie: `cookieNotificationAccepted=true; expires=Fri, 31 Dec 9999 23:59:59 GMT`,
    }
    const wrapper = shallow(<CookieNotice document={document} />)
    expect(wrapper.type()).toEqual(null)
  })

  it('sets the cookieNotificationAccepted cookie when button is clicked', () => {
    const document = {
      domain: 'test',
      cookie: '',
    }
    const wrapper = shallow(<CookieNotice document={document} />)
    wrapper.find('[data-test-id="cookieAcceptButton"]').simulate('click')
    wrapper.update()
    expect(document.cookie).toBe(
      `cookieNotificationAccepted=true; expires=Tue, 19 January 2038 03:14:07 UTC; path=/; domain=${
        document.domain
      };`,
    )
  })

  it('is no longer visible after accepting', () => {
    const document = {
      domain: 'test',
      cookie: '',
    }
    const wrapper = shallow(<CookieNotice document={document} />)

    expect(wrapper.type()).not.toEqual(null)

    wrapper.find('[data-test-id="cookieAcceptButton"]').simulate('click')
    wrapper.update()

    expect(wrapper.type()).toEqual(null)
  })
})
