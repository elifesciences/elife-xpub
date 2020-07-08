import React from 'react'
import { H1, H2, H3, Link } from '@pubsweet/ui'
import {
  Paragraph,
  NativeLink,
} from '@elifesciences/component-elife-ui/client/atoms'

const JournalFAQs = props => (
  <React.Fragment>
    <H1>Journal FAQs</H1>

    <H2 id="scoop_protection">FAQ on preprints and scoop protection</H2>

    <H3>
      1. If I have uploaded my manuscript to a preprint server, can I also
      submit it to eLife?
    </H3>
    <Paragraph.Reading>
      Yes, we encourage authors to post their manuscripts as preprints, and this
      can be done before submission, at the time of submission, or later. It is
      also possible to submit a manuscript to eLife and then post if directly to
      bioRxiv or Authorea as a preprint, and vice versa.
    </Paragraph.Reading>

    <H3>
      2. If I make an initial submission to eLife and a paper on a similar topic
      has recently been published in a peer-reviewed journal, will the other
      paper influence the treatment of my submission to eLife?
    </H3>
    <Paragraph.Reading>
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
    </Paragraph.Reading>

    <H3>
      3. If I make an initial submission to eLife and a preprint on a similar
      topic has been posted on a recognized server, will the preprint influence
      the evaluation of my submission to eLife?
    </H3>
    <Paragraph.Reading>
      No. However, in situations like this we would encourage you to post your
      initial submission as a preprint on a recognized server.
    </Paragraph.Reading>

    <H3>
      4. Does eLife offer &quot;scoop protection&quot;? In other words, if I
      make an initial submission to eLife and a paper on a similar topic is
      published in another peer-reviewed journal before a decision has been made
      on my initial submission, will the paper in the other journal influence
      the evaluation of my submission to eLife?
    </H3>
    <Paragraph.Reading>
      eLife does offer &quot;scoop protection&quot; in the sense that your
      initial submission will not be rejected on the grounds that it lacks
      novelty because of the paper in the other journal. However, it is still
      possible that the initial submission will be rejected on other grounds.
    </Paragraph.Reading>

    <H3>
      5. If I make an initial submission to eLife and a preprint on a similar
      topic is posted on a recognized server before a decision has been made on
      my initial submission, will the preprint influence the evaluation of my
      submission to eLife?
    </H3>
    <Paragraph.Reading>
      As in the previous case, your initial submission will not be rejected on
      the grounds that it lacks novelty because of the preprint. However, it is
      still possible that the initial submission will be rejected on other
      grounds.
    </Paragraph.Reading>

    <H3>
      6. If I make an initial submission to eLife and a manuscript on a similar
      topic is already being reviewed by eLife, or has been accepted for
      publication by eLife, will the other manuscript influence the evaluation
      of my submission to eLife?
    </H3>
    <Paragraph.Reading>
      As in the previous case, your initial submission will not be rejected on
      the grounds that it lacks novelty because of the other manuscript.
      However, it is still possible that the initial submission will be rejected
      on other grounds.
    </Paragraph.Reading>

    <H3>
      7. If my initial submission to eLife is available as a preprint and it
      attracts negative/critical feedback (eg, in the form of comments and/or
      other preprints) before a decision has been made, will this feedback
      influence the evaluation of my submission?
    </H3>
    <Paragraph.Reading>
      The Editors will primarily base their decision on the content of your
      submission, but public feedback on the work (positive or negative) might
      be taken into account. If a full submission is invited, you are advised to
      be open about the existence of such feedback in your cover letter.
    </Paragraph.Reading>

    <H3>8. Can I cite a preprint in my submission to eLife?</H3>
    <Paragraph.Reading>
      Yes, providing it has been posted on a recognised public preprint server
      and has a persistent ID. Preprints should be cited as follows: -
      Author(s). Year. Title. Name of preprint server. doi or url For example: -
      Narasimhan VM et al. 2016. A direct multi-generational estimate of the
      human mutation rate from autozygous segments seen in thousands of
      parentally related individuals. bioRxiv. doi:
      https://doi.org/10.1101/059436 - Chung J, Gulcehre C, Cho K, Bengio Y.
      2014. Empirical evaluation of gated recurrent neural networks on sequence
      modeling. arXiv. http://arxiv.abs/1412.3555
    </Paragraph.Reading>

    <H2 id="general_faqs">General FAQs</H2>
    <H3>1. Do you accept presubmission inquiries?</H3>
    <Paragraph.Reading>
      No, rather than advise on suitability based on an abstract, we ask that
      you prepare an <Link to="/author-guide/initial">initial submission</Link>,
      so that the complete paper can be considered in a timely manner by the
      appropriate editors. Please note that hurdles in terms of formatting
      requirements and metadata are low for initial submissions, to make them as
      painless as possible. In the case of Review Articles, please see our{' '}
      <Link to="/author-guide/types">Author Guide</Link>.
    </Paragraph.Reading>

    <H3>2. What are the formatting requirements for submission?</H3>
    <Paragraph.Reading>
      Authors generally do not need to format their paper for an{' '}
      <Link target="_blank" to="/author-guide/initial">
        initial submission
      </Link>
      , although we strongly encourage authors to embed figures and tables at
      appropriate places within the main text and we highly recommend including
      all authors for each reference in the reference list. For ease of
      submission, authors should submit a PDF of their work in the first
      instance. If a paper is encouraged for in-depth review, please consult the
      information about <Link to="/author-guide/full">full submissions</Link>.
      If a paper is invited for revisions, please consult the section about{' '}
      <Link to="/author-guide/revised">revised submissions</Link>.
    </Paragraph.Reading>

    <H3>3. When should I expect a decision?</H3>
    <Paragraph.Reading>
      We provide average decision times, before and after peer review, in the{' '}
      <NativeLink
        href="https://submit.elifesciences.org/html/elife_author_instructions.html#metrics"
        target="_blank"
      >
        Journal Metrics
      </NativeLink>{' '}
      section. Unfortunately, submissions can sometimes be delayed, often due to
      factors outside of our control. The staff monitor delayed submissions
      regularly. If you are worried about the time it is taking to receive a
      decision, it can sometimes help to send additional suggestions for editors
      or potential referees. We also encourage authors to post a preprint to
      ensure that work is disseminated in a timely manner (preprints can be
      posted before or during peer review).
    </Paragraph.Reading>

    <H3>4. Is there a publication fee?</H3>
    <Paragraph.Reading>
      Yes, information about the publication fee (also known as an Article
      Processing Charge or APC) for Research Articles, Short Reports, Tools and
      Resources, and Research Advances is included in the{' '}
      <NativeLink
        href="https://submit.elifesciences.org/html/elife_author_instructions.html#fees"
        target="_blank"
      >
        Publication Fees
      </NativeLink>{' '}
      section, along with information about waiver requests. Prospective authors
      who would like to request a waiver can do so online during the full
      submission process.
    </Paragraph.Reading>

    <H3>5. When should I expect to receive a proof?</H3>
    <Paragraph.Reading>
      For papers that have been accepted, various factors can determine when a
      proof will be sent, including the file types (LaTeX submissions can take
      longer to process), whether we are preparing an eLife digest, whether a
      press release is being planned, and the time it takes to prepare the
      Decision Letter and Author Response. Questions about papers in the
      production process can be directed to production [at] elifesciences.org.
    </Paragraph.Reading>

    <H3>6. What should I do if I want to be considered for an eLife digest?</H3>
    <Paragraph.Reading>
      All Research Articles, Short Reports or Tools and Resources are considered
      for an eLife digest. If you are the author of one of these article types
      that is currently under revision, you can improve the chances of your
      paper being selected for an eLife digest by uploading some answers to the
      questions in{' '}
      <NativeLink
        href="https://elifesciences.org/inside-elife/85518309/plain-language-summaries-how-to-write-an-elife-digest"
        target="_blank"
      >
        this blogpost
      </NativeLink>{' '}
      when you submit your revised manuscript. You can do this using the file
      type named &quot;Answers for the eLife digest&quot;. If your paper is
      selected for an eLife digest, our Features team will contact you within
      five working days of your paper&quot;s acceptance. For more information
      about this process, please see &quot;
      <NativeLink
        href="https://elifesciences.org/articles/25410"
        target="_blank"
      >
        An inside guide to eLife digests
      </NativeLink>
      &quot;.
    </Paragraph.Reading>

    <H3>
      7. Where should I send a striking image to accompany my accepted
      submission?
    </H3>
    <Paragraph.Reading>
      If you have a striking colour image we could potentially use to promote
      your article on the eLife homepage or social media, please email it to our
      production team (production [at] elifesciences.org). Images should be in
      landscape format, at least 1800 pixels wide, and must be available under
      the terms of the{' '}
      <NativeLink
        href="https://creativecommons.org/licenses/by/4.0/"
        target="_blank"
      >
        Creative Commons Attribution
      </NativeLink>{' '}
      license. To get a flavour of the kind of images we&apos;re looking for,
      please see our
      <NativeLink href="https://elifesciences.org/archive/2019" target="_blank">
        monthly archive{' '}
      </NativeLink>
      . (PNG, TIFF or JPEG formats are preferred.)
    </Paragraph.Reading>

    <H3>8. Can I reproduce a figure from an eLife article?</H3>
    <Paragraph.Reading>
      eLife articles are published under a{' '}
      <NativeLink
        href="https://creativecommons.org/licenses/by/4.0/"
        target="_blank"
      >
        Creative Commons Attribution
      </NativeLink>{' '}
      license (unless specified otherwise) that permits unrestricted use and
      redistribution provided that the original author and source are credited.
      Therefore you do not need to seek permission to reproduce an original
      figure from an eLife paper, but please cite the original author and
      source, and include the link to the corresponding license. If there are
      restrictions on the use/reuse of a figure, these will be noted in the
      legend.
    </Paragraph.Reading>

    <H3>
      9. Can I use text, figures, and tables from the paper I published in eLife
      in a thesis or dissertation?
    </H3>
    <Paragraph.Reading>
      Yes, you can. Please include a reference to the eLife paper and include a
      statement to say that the eLife article is distributed under the terms of
      a{' '}
      <NativeLink
        href="https://creativecommons.org/licenses/by/4.0/"
        target="_blank"
      >
        Creative Commons Attribution
      </NativeLink>{' '}
      that permits unrestricted use and redistribution provided that the
      original author and source are credited.
    </Paragraph.Reading>

    <H3>
      10. I would like to reproduce a figure from a previously published article
      in an eLife submission. What should I do?
    </H3>
    <Paragraph.Reading>
      It is fine to include figures that have been published under a{' '}
      <NativeLink
        href="https://creativecommons.org/licenses/by/4.0/"
        target="_blank"
      >
        Creative Commons Attribution
      </NativeLink>{' '}
      license; please cite the original author and source, and include a link to
      the corresponding licence. In other cases, please seek permission from the
      copyright holder to reuse the figure under the terms of a{' '}
      <NativeLink
        href="https://creativecommons.org/licenses/by/4.0/"
        target="_blank"
      >
        Creative Commons Attribution
      </NativeLink>{' '}
      licence.
    </Paragraph.Reading>
  </React.Fragment>
)

export default JournalFAQs
