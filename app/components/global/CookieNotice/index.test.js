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
})
