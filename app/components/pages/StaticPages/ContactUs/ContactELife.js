import React from 'react'
import { H1 } from '@pubsweet/ui'

import Paragraph from '../../../ui/atoms/Paragraph'
import List from '../../../ui/atoms/List'

const ContactELife = props => (
  <React.Fragment>
    <H1>Contact eLife</H1>

    <Paragraph.Writing>
      You can use the &quot;Check Status&quot; link under Manuscript Tasks to
      find information about your article and how long different parts of the
      editorial and review process can take. You can also read about the
      system&apos;s requirements regarding browsers, emails, and PDFs if you are
      having difficulties. If you have any further questions about submitting,
      submitted, or accepted articles, please contact our editorial or
      production teams:
    </Paragraph.Writing>

    <List.Unordered>
      <li>editorial [at] elifesciences [dot] org</li>
      <li>production [at] elifesciences [dot] org</li>
    </List.Unordered>

    <Paragraph.Writing>
      Media inquiries may be addressed to our communications team at:
    </Paragraph.Writing>

    <List.Unordered>
      <li>press [at] elifesciences [dot] org</li>
    </List.Unordered>
  </React.Fragment>
)

export default ContactELife
