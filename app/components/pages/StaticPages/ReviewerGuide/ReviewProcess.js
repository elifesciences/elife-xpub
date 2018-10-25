import React from 'react'
import { H1, Link } from '@pubsweet/ui'

import Paragraph from '../../../ui/atoms/Paragraph'
import ExternalLink from '../../../ui/atoms/ExternalLink'

const ReviewProcess = props => (
  <React.Fragment>
    <H1>The Review Process</H1>

    <Paragraph>
      For general information, we have provided an overview of the{' '}
      <Link to="/author-guide/editorial-process">editorial process</Link>,
      including how we identify the submissions that are appropriate for
      in-depth peer review.
    </Paragraph>

    <Paragraph>
      Upon receiving the full submission, a member of the Board of Reviewing
      Editors will usually review the article him or herself and solicit at
      least one other external reviewer.
    </Paragraph>

    <Paragraph>
      An online consultation session is opened with the reviewer(s) once all the
      reviews have been received. The Reviewing Editor will draft a decision
      letter, with input welcome from the other reviewer(s). A{' '}
      <ExternalLink
        href="http://elifesciences.org/about#leadership"
        target="_blank"
      >
        Senior Editor
      </ExternalLink>{' '}
      is available at each stage to provide guidance and oversight of the
      process as a whole. Our aim is to provide clear and decisive instructions
      to authors, so that they know what they need to do to get the article
      published. If a revision is requested, the decision letter will usually
      include a single set of instructions; the full reviews in this case are
      not sent to the authors. Additional rounds of revision are usually
      eliminated, as the Reviewing Editor is able to assess most revised
      submissions without re-review.
    </Paragraph>

    <Paragraph>
      If the decision is that the article cannot be revised in a reasonable time
      frame for publication in eLife and must therefore be rejected, the letter
      will usually include the full reviews, with the reasons clearly explained.
    </Paragraph>

    <Paragraph>
      We very much appreciate the efforts of our peer reviewers, and we are
      pleased to work with{' '}
      <ExternalLink href="https://publons.com/in/elife/" target="_blank">
        Publons
      </ExternalLink>{' '}
      to give researchers the opportunity to be recognised for providing reviews
      for eLife.
    </Paragraph>
  </React.Fragment>
)

export default ReviewProcess
