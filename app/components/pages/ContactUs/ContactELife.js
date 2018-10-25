import React from 'react'
import { H1 } from '@pubsweet/ui'

import Paragraph from '../../ui/atoms/Paragraph'
import List from '../../ui/atoms/List'

const ContactELife = props => (
  <React.Fragment>
    <H1>Contact eLife</H1>

    <Paragraph>
      You can use the &quot;Check Status&quot; link under Manuscript Tasks to
      find information about your article and how long different parts of the
      editorial and review process can take. You can also read about the
      system&apos;s requirements regarding browsers, emails, and PDFs if you are
      having difficulties. If you have any further questions about submitting,
      submitted, or accepted articles, please contact our editorial or
      production teams:
    </Paragraph>

    <List.Unordered>
      <li>editorial@elifesciences.org</li>
      <li>production@elifesciences.org</li>
      <li>editorial@elifesciences.org</li>
    </List.Unordered>

    <Paragraph>
      Media inquiries may be addressed to our communications team at:
    </Paragraph>

    <List.Unordered>
      <li>press@elifesciences.org</li>
    </List.Unordered>
  </React.Fragment>
)

export default ContactELife
