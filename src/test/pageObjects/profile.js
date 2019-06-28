import { Selector } from 'testcafe'

const profile = {
  open: Selector('[data-test-id=profile-menu'),
  name: Selector('[data-test-id=profile-name]'),
}

export default profile
