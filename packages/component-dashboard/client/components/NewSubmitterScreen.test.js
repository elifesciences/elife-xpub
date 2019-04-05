import React from 'react'
import { shallow } from 'enzyme'
import NewSubmitterScreen from './NewSubmitterScreen'

describe('NewSubmitterScreen', () => {
  it('renders a new manuscript button', () => {
    const screen = shallow(<NewSubmitterScreen />)

    expect(screen.find('[data-test-id="desktop-new-submission"]')).toHaveLength(
      1,
    )
  })

  it('contains the privacy footer information', () => {
    const screen = shallow(<NewSubmitterScreen />)
    expect(screen.find('FooterPrivacy')).toHaveLength(1)
  })

  it('contains the correct links', () => {
    const screen = shallow(<NewSubmitterScreen />)
    expect(
      screen.findWhere(
        n => n.prop('href') === 'https://submit.elifesciences.org',
      ),
    ).toHaveLength(1)
    expect(
      screen.findWhere(
        n =>
          n.prop('href') ===
          'https://reviewer.elifesciences.org/contact-us/contact-elife',
      ),
    ).toHaveLength(1)
  })
})
