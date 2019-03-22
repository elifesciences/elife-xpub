import React from 'react'
import { H1, H2, Link } from '@pubsweet/ui'

import Paragraph from 'ui/atoms/Paragraph'
import NativeLink from 'ui/atoms/NativeLink'
import List from '../../components/List'

const ReviewingPolicies = props => (
  <React.Fragment>
    <H1>Reviewing Policies</H1>

    <Paragraph.Reading>
      We encourage our reviewers to familiarise themselves with{' '}
      <Link to="/reviewer-guide/reviewing-policies">
        eLife&apos;s journal policies
      </Link>{' '}
      before the review process commences.
    </Paragraph.Reading>

    <H2>Confidentiality and co-review</H2>

    <Paragraph.Reading>
      The review process is strictly confidential and must be treated as such by
      reviewers during the review process and subsequently. However,
      co-reviewing a manuscript with a single experienced junior colleague can
      be an important learning experience that we are happy to support. To
      provide accountability and appropriate credit, the name of the co-referee
      should be disclosed to the editors in advance and we would encourage all
      reviewers to consider sharing their names with the authors. The two
      co-reviewers should agree on the wording of the review, and the same
      principles relating to confidentiality and competing interests apply to
      both reviewers. The senior reviewer should be the main point of contact
      for the discussion between the reviewers, but the senior reviewer can
      confer with their co-reviewer during this discussion.
    </Paragraph.Reading>

    <Paragraph.Reading>
      Other than co-reviewing for training purposes, reviewers should not
      contact anyone not directly involved with the assessment of the article,
      including colleagues or other experts in the field, unless this has been
      discussed and approved in advance by the Reviewing Editor.
    </Paragraph.Reading>

    <Paragraph.Reading>
      The content of the consultation session between the reviewers is also
      confidential and it is the role of the Reviewing Editor to draft the
      decision letter, based on the reviews and the discussion between the
      reviewers.
    </Paragraph.Reading>

    <H2>Reviewer Anonymity</H2>

    <Paragraph.Reading>
      We do not release the identities of the reviewers to the authors (unless
      requested by the reviewers themselves) but in the course of the discussion
      that forms part of the review process, each reviewer will know the
      identity of the other reviewer(s). We also request each reviewer’s
      permission to reveal his or her identity and report to another journal, if
      the work is rejected and the author requests the reports for the purposes
      of submission to another journal.
    </Paragraph.Reading>

    <H2>Competing Interests</H2>

    <Paragraph.Reading>
      We ask reviewers to recognise potential competing interests that could
      lead them to be positively or negatively disposed towards an article. We
      follow the recommendations of the{' '}
      <NativeLink
        href="http://www.icmje.org/recommendations/browse/roles-and-responsibilities/author-responsibilities--conflicts-of-interest.html"
        target="_blank"
      >
        ICMJE
      </NativeLink>{' '}
      and the guidance provided by{' '}
      <NativeLink
        href="http://journals.plos.org/plosmedicine/s/competing-interests"
        target="_blank"
      >
        PLOS
      </NativeLink>
      . Reviewers should inform the editors or journal staff if they are close
      competitors or collaborators of the authors. Reviewers must recuse
      themselves if they feel that they are unable to offer an impartial review.
      Common reasons for editors and reviewers to recuse themselves from the
      peer-review process include but are not limited to:
    </Paragraph.Reading>

    <List.Unordered>
      <li>
        Working at the same institution or organization as one or more of the
        authors, currently or recently
      </li>
      <li>
        Having collaborated with, or served as a mentor to, one or more of the
        authors during the past 5 years
      </li>
      <li>
        Having held grants with one or more of the authors, currently or
        recently
      </li>
      <li>
        Having a personal relationship with an author that does not allow him or
        her to evaluate the manuscript objectively
      </li>
    </List.Unordered>

    <Paragraph.Reading>
      We will make every effort to follow authors’ requests to exclude potential
      reviewers, provided that a specific reason is provided.
    </Paragraph.Reading>

    <Paragraph.Reading>
      <strong>Research Conducted by eLife.</strong> As a way of improving our
      services, we periodically undertake research and surveys relating to
      eLife&apos;s submission and review process. Where appropriate we will
      share our findings so that others can benefit. Participation does not
      affect the decision on manuscripts under consideration, or our policies
      relating to the confidentiality of the review process. If you would like
      to opt out of eLife&apos;s research and/or surveys, please contact the
      journal office (
      <NativeLink href="mailto:editorial@elifesciences.org" target="_blank">
        here
      </NativeLink>
      ).
    </Paragraph.Reading>
  </React.Fragment>
)

export default ReviewingPolicies
