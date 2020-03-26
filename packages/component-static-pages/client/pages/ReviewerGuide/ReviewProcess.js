import React from 'react'
import { H1, H2, Link } from '@pubsweet/ui'

import {
  Paragraph,
  NativeLink,
} from '@elifesciences/component-elife-ui/client/atoms'

import List from '../../components/List'

const ReviewProcess = props => (
  <React.Fragment>
    <H1>The Review Process</H1>

    <Paragraph.Reading>
      For general information, we have provided an overview of the{' '}
      <Link to="/author-guide/editorial-process">editorial process</Link>,
      including how we identify the submissions that are appropriate for
      in-depth peer review.
    </Paragraph.Reading>

    <Paragraph.Reading>
      Upon receiving the full submission, a member of the Board of Reviewing
      Editors will usually review the article him or herself and solicit at
      least one other external reviewer.
    </Paragraph.Reading>

    <Paragraph.Reading>
      An online consultation session is opened with the reviewer(s) once all the
      reviews have been received. The Reviewing Editor will draft a decision
      letter, with input welcome from the other reviewer(s). A{' '}
      <NativeLink
        href="http://elifesciences.org/about#leadership"
        target="_blank"
      >
        Senior Editor
      </NativeLink>{' '}
      is available at each stage to provide guidance and oversight of the
      process as a whole. Our aim is to provide clear and decisive instructions
      to authors, so that they know what they need to do to get the article
      published. If a revision is requested, the decision letter will usually
      include a single set of instructions; the full reviews in this case are
      not sent to the authors. Additional rounds of revision are usually
      eliminated, as the Reviewing Editor is able to assess most revised
      submissions without re-review.
    </Paragraph.Reading>

    <Paragraph.Reading>
      If the decision is that the article cannot be revised in a reasonable time
      frame for publication in eLife and must therefore be rejected, the letter
      will usually include the full reviews, with the reasons clearly explained.
    </Paragraph.Reading>

    <Paragraph.Reading>
      We very much appreciate the efforts of our peer reviewers, and we are
      pleased to work with{' '}
      <NativeLink href="https://publons.com/in/elife/" target="_blank">
        Publons
      </NativeLink>{' '}
      to give researchers the opportunity to be recognised for providing reviews
      for eLife.
    </Paragraph.Reading>

<H2>Involvement of early-career researchers in peer review</H2>

<Paragraph.Reading>
eLife encourages editors to nominate and involve early-career researchers in the 
review process. The{' '} 
<NativeLink href="https://elifesciences.org/inside-elife/31a5173b" target="_blank">
eLife pool of early-career reviewers
</NativeLink>{' '}
aims to provide outstanding early-stage researchers the opportunity to peer review manuscripts. 
Members of the pool are nominated and/or approved by the eLife editors.
</Paragraph.Reading>

<Paragraph.Reading>
To be eligible, researchers have to be either a postdoctoral researcher or have spent less than 
five years in an independent research position (e.g. Group Leader). It is also a requirement to 
have had at least two first-author publications in an area of research within the scope of eLife. 
Researchers wishing to be considered for this pool should contact the journal staff (
<NativeLink href="mailto:editorial@elifesciences.org" target="_blank">
editorial@elifesciences.org
</NativeLink>
) and provide:
</Paragraph.Reading>

<Paragraph.Reading>
<List.Unordered>
  <li>A brief letter of endorsement from their supervisor (optional)</li>
  <li>Their CV</li>
  <li>The link to their webpage or, at a minimum, another site with 
    details about their work (e.g. Google Scholar, Publons or ORCID)</li>
  <li>Two representative first-author publications</li>
  <li>4-8 keywords and 1-3{' '}
<NativeLink href="https://elifesciences.org/subjects" target="_blank">
subject areas of eLife
</NativeLink>{ ' '}
 relevant to their research, and</li>
<li>A short list of eLife Reviewing Editors they could work with</li>
</List.Unordered>
Self-nominations will be reviewed by at least one eLife Reviewing Editor.
</Paragraph.Reading>

<Paragraph.Reading>
  eLife also encourages reviewers to involve early-career colleagues as co-reviewers, 
  and we enable all reviewers to receive credit for their contributions through services 
  such as Publons and ORCID.
 </Paragraph.Reading>
  

  </React.Fragment>
)

export default ReviewProcess
