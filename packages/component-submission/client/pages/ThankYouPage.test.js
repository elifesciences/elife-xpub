import React from 'react'
import { shallow } from 'enzyme'
import { ThankYouPage } from './ThankYouPage'

describe('ThankYou', () => {
  it('has a hotjar supress attribute on the element around the title', () => {
    const originalWindow = global.window
    global.window.hj = jest.fn

    const wrapper = shallow(
      <ThankYouPage
        data={{
          manuscript: {
            meta: {
              title: 'Hello World',
            },
          },
        }}
      />,
    )
    expect(
      wrapper.find('[data-test-id="title"][data-hj-suppress=""]'),
    ).toHaveLength(1)

    global.window = originalWindow
  })
})
