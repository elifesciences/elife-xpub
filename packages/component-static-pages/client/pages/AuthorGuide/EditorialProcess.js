import React from 'react'
import { H1, H2, Link } from '@pubsweet/ui'
import {
  Paragraph,
  NativeLink,
} from '@elifesciences/component-elife-ui/client/atoms'

import CalloutTextBox from '../../components/CalloutTextBox'
import List from '../../components/List'

const EditorialProcess = props => (
  <React.Fragment>
    <H1>The Editorial Process</H1>

    <Paragraph.Reading>
      eLife is a selective journal that publishes{' '}
      <NativeLink
        href="https://elifesciences.org/elife-news/what-are-elife-papers-made-of"
        target="_blank"
      >
        promising research
      </NativeLink>{' '}
      in all areas of biology and medicine. Leading academic researchers on our
      editorial board evaluate all new submissions. The editors elect to send
      around 30% of manuscripts, those that they believe are of the highest
      scientific standards and importance, to external experts for in-depth peer
      review. More than half of the articles that are selected for peer review
      are ultimately published in eLife, for an overall acceptance rate of
      around 16%.
    </Paragraph.Reading>

    <Paragraph.Reading>
      To increase the accessibility of research and ensure that it is
      communicated rapidly, we expect authors to post their research as a
      preprint (using preprint servers such as{' '}
      <NativeLink href="http://biorxiv.org/" target="_blank">
        bioRxiv
      </NativeLink>
      ,{' '}
      <NativeLink href="https://www.medrxiv.org/" target="_blank">
        medRxiv
      </NativeLink>{' '}
      or
      <NativeLink href="https://www.authorea.com/" target="_blank">
        Authorea
      </NativeLink>
      ), either before submission to eLife or during the review process. The
      advantages of posting a preprint have been summarised by{' '}
      <NativeLink
        href="https://elifesciences.org/elife-news/what-are-elife-papers-made-of"
        target="_blank"
      >
        ASAPbio
      </NativeLink>
      . Authors can upload a preprint to{' '}
      <NativeLink href="http://biorxiv.org/" target="_blank">
        bioRxiv
      </NativeLink>{' '}
      or{' '}
      <NativeLink href="https://www.authorea.com/" target="_blank">
        Authorea
      </NativeLink>{' '}
      and then transfer their files directly to eLife for consideration, they
      can have their work transferred to{' '}
      <NativeLink href="http://biorxiv.org/" target="_blank">
        bioRxiv
      </NativeLink>{' '}
      during the full submission process, or they can post the preprint
      themselves to an appropriate preprint server at any point before
      acceptance.
    </Paragraph.Reading>

    <CalloutTextBox>
      <H2>Preprint Review</H2>
      <Paragraph.Reading>
        Authors who have posted their research as a preprint to bioRxiv are
        invited to have their work considered for publication in eLife and
        simultaneously peer-reviewed in-depth on bioRxiv through our Preprint
        Review service. Submissions to Preprint Review will proceed directly to
        peer review, provided we have appropriate expertise and capacity on our
        editorial board. All resulting peer reviews will be posted to bioRxiv
        and will independently inform a decision about whether to publish the
        paper in eLife. Authors will be given an opportunity to respond to the
        reviews prior to posting, but they cannot veto the posting of reviews.
      </Paragraph.Reading>
      <Paragraph.Reading>
        Please read our{' '}
        <NativeLink
          href="https://elifesciences.org/inside-elife/d0c5d114/new-from-elife-invitation-to-submit-to-preprint-review"
          target="_blank"
        >
          announcement
        </NativeLink>{' '}
        for more details and restrictions. To opt in, please refer to the
        &quot;Preprint Review&quot; service clearly in your cover letter and
        include a link to the preprint.
      </Paragraph.Reading>
    </CalloutTextBox>

    <Paragraph.Reading>
      Alternatively, authors can submit to eLife directly, or they can submit
      using the{' '}
      <NativeLink
        href="https://www.overleaf.com/latex/templates/elife-latex-template/csqxykvsnyxm#.WIs5NLaLRGw"
        target="_blank"
      >
        Overleaf
      </NativeLink>{' '}
      or{' '}
      <NativeLink href="https://www.authorea.com/" target="_blank">
        Authorea
      </NativeLink>{' '}
      authorship tools. Authors working in LaTeX can download and use our{' '}
      <NativeLink
        href="https://elife-cdn.s3.amazonaws.com/author-guide/elife-latex-template.zip"
        target="_blank"
      >
        template
      </NativeLink>{' '}
      or{' '}
      <NativeLink
        href="https://www.overleaf.com/latex/templates/elife-latex-template/csqxykvsnyxm"
        target="_blank"
      >
        open it directly in Overleaf
      </NativeLink>{' '}
      .
    </Paragraph.Reading>

    <Paragraph.Reading>
      We are also committed to treating all authors and manuscripts as fairly as
      possible, and we offer &quot;scoop protection&quot; in the sense that, if
      other researchers publish similar findings after submission, this will not
      be a reason for rejection. Please see{' '}
      <NativeLink
        href="https://elifesciences.org/articles/30076"
        target="_blank"
      >
        this editorial
      </NativeLink>{' '}
      and <NativeLink href="#scoop_protection">the FAQ</NativeLink> below for
      more details on our policies on preprints and scoop protection.
    </Paragraph.Reading>

    <CalloutTextBox>
      <Paragraph.Reading>
        On January 1, 2017, eLife introduced a fee for publication. A fee of
        $2,500* is collected for all published papers submitted on or after this
        date; however, authors with insufficient funding to pay the fee are
        eligible for a fee waiver (
        <Link to="/author-guide/fees">read more</Link>
        ).
      </Paragraph.Reading>
    </CalloutTextBox>

    <Paragraph.Reading>
      The eLife editorial process broadly occurs in three phases. Authors
      submitting to eLife should be familiar with our journal{' '}
      <Link to="/author-guide/journal-policies">policies</Link>. If you have
      received an encouraging response to your initial submission, please review
      the guidelines relating to full submissions. If your full submission has
      been peer reviewed and you have been asked to make revisions, please
      review our guidelines for revised submissions.
    </Paragraph.Reading>

    <H2>Initial Submissions</H2>

    <Paragraph.Reading>
      If you are interested in submitting your work to eLife, please review the
      guidelines relating to{' '}
      <Link to="/author-guide/initial">Initial Submissions</Link>. We refer
      authors to{' '}
      <NativeLink
        href="https://elifesciences.org/articles/48175?_ga=2.87814296.1615571170.1583746607-392198663.1550050583"
        target="_blank"
      >
        “Ten common statistical mistakes to watch out for when writing or
        reviewing a manuscript”
      </NativeLink>{' '}
      and eLife&apos;s{' '}
      <NativeLink
        href="https://elife-cdn.s3.amazonaws.com/xpub/guides/transparent_reporting.pdf"
        target="_blank"
      >
        Transparent Reporting Form
      </NativeLink>{' '}
      as they prepare their submission. During the initial submission phase,
      members of eLife&apos;s senior editorial team assess new submissions,
      often in consultation with members of the Board of Reviewing Editors or
      with external guest editors where necessary, to identify the ones that are
      appropriate for in-depth peer review.
    </Paragraph.Reading>

    <List.Ordered>
      <li>
        To simplify the submission process, authors should submit their full
        manuscript as a single PDF. Limited additional information is collected
        via the submission screen questions to complete the submission.
      </li>
      <li>Authors will need to provide a cover letter.</li>
      <li>
        Limited additional information is collected via the submission screen
        questions. Only corresponding author details are needed at this stage,
        along with suggestions for appropriate editors, and individuals who
        should be excluded from the review process.
      </li>
    </List.Ordered>

    <H2>Full Submissions</H2>
    <Paragraph.Reading>
      For manuscripts that are invited for in-depth peer review, we request more
      detailed information about the work to support the peer review process,
      for example names of co-authors, details of major datasets, and ethics
      statements. Authors are asked to agree to publish their work under the
      terms of the Creative Commons Attribution license (
      <NativeLink
        href="https://cdn.elifesciences.org/xpub/guides/CCBY_4.0.pdf"
        target="_blank"
      >
        PDF of the agreement
      </NativeLink>
      ), or the Creative Commons CC0 public domain dedication (
      <NativeLink
        href="https://cdn.elifesciences.org/xpub/guides/CC0_1.0.pdf"
        target="_blank"
      >
        PDF of the agreement
      </NativeLink>
      ) if one or more authors are US-government employees.
    </Paragraph.Reading>

    <H2>Revised Submissions</H2>
    <Paragraph.Reading>
      We will require a response to the essential revision requirements outlined
      in the decision letter. A response to minor comments is optional. In the
      event of acceptance, the substantive revision requests and the authors’
      response will be published, under the terms of the{' '}
      <NativeLink
        href="http://creativecommons.org/licenses/by/4.0/"
        target="_blank"
      >
        Creative Commons Attribution license
      </NativeLink>
      .
    </Paragraph.Reading>

    <CalloutTextBox>
      Authors can submit their research as one of several{' '}
      <Link to="/author-guide/types">article types</Link>.
    </CalloutTextBox>
  </React.Fragment>
)

export default EditorialProcess
