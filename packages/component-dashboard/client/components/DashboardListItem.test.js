import { subDays } from 'date-fns'

import { dashboardDateText } from './DashboardListItem'

describe('DashboardListItem', () => {
  describe('dashboardDateText', () => {
    it('show invalid for future date', () => {
      expectText(-1, 'Invalid date')
    })
    it('handles bad argument', () => {
      const value = dashboardDateText(Object())
      expect(value).toBe('Invalid date')
    })
    it('shows correct text', () => {
      expectText(0, 'Today')
      expectText(1, 'Yesterday')
      expectText(2, '2 days ago')
      expectText(6, '6 days ago')
      expectText(13, '13 days ago')
      expectText(14, '2 weeks ago')
      expectText(29, '4 weeks ago')
      expectText(30, '1 month ago')
      expectText(44, '1 month ago')
      expectText(45, '2 months ago')
      expectText(364, '12 months ago')
      expectText(729, '24 months ago')
      expectText(730, '2 years ago')
      expectText(1460, '4 years ago')
    })
  })
})

function expectText(daysAgo, expectedText) {
  const value = dashboardDateText(subDays(new Date(), daysAgo))
  expect(value).toBe(expectedText)
}
