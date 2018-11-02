import React from 'react'
import { H1, H2, H3, Link } from '@pubsweet/ui'

import Paragraph from '../../../ui/atoms/Paragraph'
import CalloutTextBox from '../../../ui/atoms/CalloutTextBox'
import NativeLink from '../../../ui/atoms/NativeLink'
import List from '../../../ui/atoms/List'

const EditorialProcess = props => (
  <React.Fragment>
    <H1>The Editorial Process</H1>

    <Paragraph>
      eLife publishes{' '}
      <NativeLink
        href="https://elifesciences.org/elife-news/what-are-elife-papers-made-of"
        target="_blank"
      >
        promising research
      </NativeLink>{' '}
      across the life sciences and biomedicine. Before you submit your work,
      please note that eLife is a very selective journal that aims to publish
      work of the highest scientific standards and importance. Leading academic
      researchers evaluate new submissions and approximately two-thirds are
      returned to the authors without further peer review. Approximately half of
      the articles that are selected for peer review go on to be published.
    </Paragraph>

    <Paragraph>
      To help increase the accessibility of research and ensure that it is
      communicated as rapidly as possible, authors are encouraged to make use of
      preprint servers, such as{' '}
      <NativeLink href="http://biorxiv.org/" target="_blank">
        bioRxiv
      </NativeLink>{' '}
      or
      <NativeLink href="https://www.authorea.com/" target="_blank">
        Authorea
      </NativeLink>
      , while their paper is under consideration by eLife. The advantages of
      depositing early versions of an article are summarised on the{' '}
      <NativeLink
        href="https://elifesciences.org/elife-news/what-are-elife-papers-made-of"
        target="_blank"
      >
        ASAPbio
      </NativeLink>{' '}
      website. Authors can upload a preprint to{' '}
      <NativeLink href="http://biorxiv.org/" target="_blank">
        bioRxiv
      </NativeLink>{' '}
      or
      <NativeLink href="https://www.authorea.com/" target="_blank">
        Authorea
      </NativeLink>{' '}
      and then transfer their files for consideration by eLife.
    </Paragraph>

    <Paragraph>
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
    </Paragraph>

    <Paragraph>
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
    </Paragraph>

    <CalloutTextBox>
      <Paragraph>
        On January 1, 2017, eLife introduced a fee for publication. A fee of
        $2,500* is collected for all published papers submitted on or after this
        date; however, authors with insufficient funding to pay the fee are
        eligible for a fee waiver (
        <NativeLink href="/author-guide/fees#">read more</NativeLink>
        ).
      </Paragraph>
    </CalloutTextBox>

    <Paragraph>
      The eLife editorial process broadly occurs in three phases. Authors
      submitting to eLife should be familiar with our journal{' '}
      <Link to="/author-guide/journal-policies">policies</Link>. If you have
      received an encouraging response to your initial submission, please review
      the guidelines relating to full submissions. If your full submission has
      been peer reviewed and you have been asked to make revisions, please
      review our guidelines for revised submissions.
    </Paragraph>

    <H2>Initial Submissions</H2>

    <Paragraph>
      If you are interested in submitting your work to eLife, please review the
      guidelines relating to{' '}
      <Link to="/author-guide/initial">Initial Submissions</Link>. During the
      initial submission phase, members of eLife’s{' '}
      <NativeLink
        href="https://elifesciences.org/about/people?_ga=2.223585432.2069272108.1540132848-2034406101.1537543708"
        target="_blank"
      >
        senior editorial team
      </NativeLink>{' '}
      rapidly assess new submissions, often in consultation with members of the
      Board of Reviewing Editors or with external guest editors where necessary,
      to identify the ones that are appropriate for in-depth peer review.
    </Paragraph>

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
    <Paragraph>
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
    </Paragraph>

    <H2>Revised Submissions</H2>
    <Paragraph>
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
    </Paragraph>

    <H2 id="scoop_protection">FAQ on preprints and scoop protection</H2>

    <H3>
      1. If I have uploaded my manuscript to a preprint server, can I also
      submit it to eLife?
    </H3>
    <Paragraph>
      Yes, we encourage authors to post their manuscripts as preprints, and this
      can be done before submission, at the time of submission, or later. It is
      also possible to submit a manuscript to eLife and then post if directly to
      bioRxiv or Authorea as a preprint, and vice versa.
    </Paragraph>

    <H3>
      2. If I make an initial submission to eLife and a paper on a similar topic
      has recently been published in a peer-reviewed journal, will the other
      paper influence the treatment of my submission to eLife?
    </H3>
    <Paragraph>
      The Editors always take the existing literature into account when making
      decisions about submissions, so situations like this are dealt with on a
      case-by-case basis. However, eLife does not subscribe to a
      &apos;winner-takes-all&apos; philosophy, and does not automatically reject
      papers because they are not &apos;first&apos; (please see{' '}
      <NativeLink
        href="https://elifesciences.org/articles/05770?_ga=2.156477752.2069272108.1540132848-2034406101.1537543708"
        target="_blank"
      >
        Malhotra and Marder, 2015
      </NativeLink>{' '}
      and{' '}
      <NativeLink
        href="https://elifesciences.org/articles/30076"
        target="_blank"
      >
        Marder, 2017
      </NativeLink>
      ).
    </Paragraph>

    <H3>
      3. If I make an initial submission to eLife and a preprint on a similar
      topic has been posted on a recognized server, will the preprint influence
      the evaluation of my submission to eLife?
    </H3>
    <Paragraph>
      No. However, in situations like this we would encourage you to post your
      initial submission as a preprint on a recognized server.
    </Paragraph>

    <H3>
      4. Does eLife offer &quot;scoop protection&quot;? In other words, if I
      make an initial submission to eLife and a paper on a similar topic is
      published in another peer-reviewed journal before a decision has been made
      on my initial submission, will the paper in the other journal influence
      the evaluation of my submission to eLife?
    </H3>
    <Paragraph>
      eLife does offer &quot;scoop protection&quot; in the sense that your
      initial submission will not be rejected on the grounds that it lacks
      novelty because of the paper in the other journal. However, it is still
      possible that the initial submission will be rejected on other grounds.
    </Paragraph>

    <H3>
      5. If I make an initial submission to eLife and a preprint on a similar
      topic is posted on a recognized server before a decision has been made on
      my initial submission, will the preprint influence the evaluation of my
      submission to eLife?
    </H3>
    <Paragraph>
      As in the previous case, your initial submission will not be rejected on
      the grounds that it lacks novelty because of the preprint. However, it is
      still possible that the initial submission will be rejected on other
      grounds.
    </Paragraph>

    <H3>
      6. If I make an initial submission to eLife and a manuscript on a similar
      topic is already being reviewed by eLife, or has been accepted for
      publication by eLife, will the other manuscript influence the evaluation
      of my submission to eLife?
    </H3>
    <Paragraph>
      As in the previous case, your initial submission will not be rejected on
      the grounds that it lacks novelty because of the other manuscript.
      However, it is still possible that the initial submission will be rejected
      on other grounds.
    </Paragraph>

    <H3>
      7. If my initial submission to eLife is available as a preprint and it
      attracts negative/critical feedback (eg, in the form of comments and/or
      other preprints) before a decision has been made, will this feedback
      influence the evaluation of my submission?
    </H3>
    <Paragraph>
      The Editors will primarily base their decision on the content of your
      submission, but public feedback on the work (positive or negative) might
      be taken into account. If a full submission is invited, you are advised to
      be open about the existence of such feedback in your cover letter.
    </Paragraph>

    <H3>8. Can I cite a preprint in my submission to eLife?</H3>
    <Paragraph>
      Yes, providing it has been posted on a recognised public preprint server
      and has a persistent ID. Preprints should be cited as follows: -
      Author(s). Year. Title. Name of preprint server. doi or url For example: -
      Narasimhan VM et al. 2016. A direct multi-generational estimate of the
      human mutation rate from autozygous segments seen in thousands of
      parentally related individuals. bioRxiv. doi:
      https://doi.org/10.1101/059436 - Chung J, Gulcehre C, Cho K, Bengio Y.
      2014. Empirical evaluation of gated recurrent neural networks on sequence
      modeling. arXiv. http://arxiv.abs/1412.3555
    </Paragraph>

    <CalloutTextBox>
      Authors can submit their research as one of several{' '}
      <Link to="/author-guide/types">article types</Link>.
    </CalloutTextBox>
  </React.Fragment>
)

export default EditorialProcess
