import React from 'react'
import { H1, H2, Link } from '@pubsweet/ui'

import {
  Paragraph,
  NativeLink,
} from '@elifesciences/component-elife-ui/client/atoms'
import CalloutTextBox from '../../components/CalloutTextBox'
import List from '../../components/List'

const Types = props => (
  <React.Fragment>
    <H1>Article Types</H1>

    <Paragraph.Reading>
      eLife publishes the following article types.
    </Paragraph.Reading>

    <H2>Editorials, Insights, and Feature articles</H2>

    <Paragraph.Reading>
      <NativeLink
        href="https://elifesciences.org/articles/editorial"
        target="_blank"
      >
        Editorials
      </NativeLink>{' '}
      in eLife are written by eLife editors or staff.
    </Paragraph.Reading>

    <Paragraph.Reading>
      <NativeLink
        href="https://elifesciences.org/articles/insight"
        target="_blank"
      >
        Insights
      </NativeLink>{' '}
      are commissioned by eLife staff and are always related to a Research
      Article published in the journal. Insights are written by experts in the
      field of the Research Article: they explain why the results reported are
      significant and outline some of the challenges that remain in the field.
    </Paragraph.Reading>

    <Paragraph.Reading>
      <NativeLink
        href="https://elifesciences.org/articles/feature"
        target="_blank"
      >
        Feature Articles
      </NativeLink>{' '}
      should offer fresh insights into topics of broad interest to readers
      working in the life and biomedical sciences. There are no strict limits on
      length, but authors are advised to stay below 2000 words, two display
      items (figures, tables etc) and 20 references if possible, and to write in
      an active/engaging style. Feature Articles are peer reviewed at the
      discretion of the eLife editors and staff. Queries should be sent to the
      Features Editor at features [at] elifesciences [dot] org.
    </Paragraph.Reading>

    <H2>Research Articles</H2>

    <Paragraph.Reading>
      There is no maximum length for Research Articles, but we suggest that
      authors try not to exceed 5,000 words in the main text, excluding the
      Materials and methods, References, and Figure legends. There are no limits
      on the number of display items. The main text of the article should
      usually be structured and ordered as follows: Introduction; Results;
      Discussion; Materials and Methods (or Methods); Acknowledgements;
      References; Figures with the corresponding legend below each one; and
      Tables. A Methods or Model section can appear after the Introduction where
      it makes sense to do so.
    </Paragraph.Reading>

    <H2>Short Reports</H2>

    <Paragraph.Reading>
      We welcome the submission of Short Reports, for example reporting the
      results of a single set of experiments, provided the conclusion is clear
      and justified, and the findings are novel and judged to be of high
      importance. Short Reports should not usually exceed 1,500 words in the
      main text, excluding the Materials and Methods, References, and Figure
      legends, with no more than three or four main display items (figures,
      tables, videos). Authors have more flexibility in the format, for example
      with a combined Results and Discussion section.
    </Paragraph.Reading>

    <H2>Tools and Resources</H2>

    <Paragraph.Reading>
      This category highlights tools or resources that are especially important
      for their respective fields and have the potential to accelerate
      discovery. For example, we welcome the submission of significant
      technological or methodological advances, genomic or other datasets,
      collections of biological resources, software tools, and so on. The
      article should fully describe the tool or resource so that prospective
      users have all the information needed to deploy it within their own work.
      Therefore, major datasets must be publicly deposited (unless there are
      strong ethical or legal reasons to restrict access); relevant code must
      conform to the{' '}
      <NativeLink href="https://opensource.org/docs/osd" target="_blank">
        Open Source Definition
      </NativeLink>{' '}
      and be deposited in an appropriate public repository; and methodological
      advances need to be comprehensively described, along with details of the
      reagents and equipment, and their sources. Authors should follow the
      format for Research Articles or Short Reports, as appropriate.
    </Paragraph.Reading>

    <Paragraph.Reading>
      Tools and Resources articles do not have to report major new biological
      insights or mechanisms, but it must be clear that they will enable such
      advances to take place. Specifically, submissions will be assessed in
      terms of their potential to facilitate experiments that address problems
      that to date have been challenging or even intractable. Some Tools and
      Resources papers will be the first report of an entirely novel technology.
      In many other cases, authors will wish to report substantial improvements
      and extensions of existing technologies. In those cases, the new method
      should be properly compared and benchmarked against existing methods used
      in the field. Minor improvements on existing methodologies are unlikely to
      fare well in review.
    </Paragraph.Reading>

    <H2>Research Advances</H2>

    <Paragraph.Reading>
      This format is for substantial developments that directly build upon a
      Research Article, Short Report or Tools and Resources article published
      previously by eLife. A Research Advance can be submitted by some or all of
      the authors of the original paper and/or researchers who were not involved
      in the original paper. A Research Advance might use a new technique or a
      different experimental design to generate results that build upon the
      conclusions of the original research by, for example, providing new
      mechanistic insights or extend the pathway under investigation. Research
      Advances can also report significant improvements to experimental tools
      and techniques.
    </Paragraph.Reading>

    <Paragraph.Reading>
      Research Advances can be of any length, and any number of main display
      items, but there may only need to be minimal introductory material.
      Authors have flexibility in the format, for example with a combined
      Results and Discussion section, and there is no need for a detailed
      Materials and Methods section when the methods are the same as the
      original paper. Authors should upload a completed version of the
      Transparent Reporting Form (
      <NativeLink
        href="https://cdn.elifesciences.org/xpub/guides/transparent_reporting.pdf"
        target="_blank"
      >
        PDF
      </NativeLink>
      ;{' '}
      <NativeLink
        href="https://cdn.elifesciences.org/xpub/guides/transparent_reporting.docx"
        target="_blank"
      >
        Word
      </NativeLink>
      ) to accompany their submission.
    </Paragraph.Reading>

    <Paragraph.Reading>
      When published, Research Advances are linked to the original article, and
      they are indexed and citable in their own right. When the authors of the
      original article are not involved in the Research Advance, the
      corresponding author of the original study will be asked for comments
      during the review process. Where appropriate, the Research Advance will be
      considered by the same editors and reviewers who were involved in the
      assessment of the original paper.{' '}
    </Paragraph.Reading>

<H2>Review Articles</H2>

    <Paragraph.Reading>
      Review Articles are commissioned by eLife Senior Editors. If you would like to 
      propose a Review Article, please send an outline to the most relevant{' '}
      <NativeLink href="https://elifesciences.org/about/people"target="_blank">
        Senior Editor
      </NativeLink>. 
      The outline should include: i) 50-100 words on each of the main sections of the 
      proposed article; ii) a paragraph on why it would be timely to publish an article 
      on this topic now; iii) a paragraph on why you are a suitable author for such an article.
    </Paragraph.Reading>

    <H2>Scientific Correspondence</H2>

    <Paragraph.Reading>
      This format should be used for a manuscript that challenges the central
      findings of a paper published in eLife, and for the formal response to
      such a manuscript. In the first instance, the author must contact the
      corresponding author of the original eLife paper in an effort to resolve
      matters (and include evidence of these efforts in their initial
      submission). Scientific Correspondence must also be submitted within a
      year of the original eLife paper being published.
    </Paragraph.Reading>

    <Paragraph.Reading>
      The title of the manuscript should be &apos;Comment on &apos;Title of
      original article&apos; &apos;, and it should be written in a measured
      tone; manuscripts not written in measured tone will be sent back to the
      authors for revision: please read{' '}
      <NativeLink
        href="https://elifesciences.org/inside-elife/08093bce/elife-latest-introducing-scientific-correspondence-at-elife?_ga=2.134784754.2069272108.1540132848-2034406101.1537543708"
        target="_blank"
      >
        this blogpost
      </NativeLink>{' '}
      for more information.
    </Paragraph.Reading>

    <Paragraph.Reading>
      Where possible, the initial submission is considered by the Senior Editor
      and the Reviewing Editor who handled the original paper (and by others if
      necessary). In the first instance the Editors will decide if any of the
      issues raised in the initial submission require a formal Correction to the
      original article: if a correction is required, the corresponding author of
      the original paper will be contacted and the Scientific Correspondence
      will be put on hold until the Correction has been finalized. If a
      Correction is published and discrepancies between the original paper and
      the challenge remain, the authors of the Scientific Correspondence will be
      asked to revise their submission accordingly.
    </Paragraph.Reading>

    <Paragraph.Reading>
      If the Editors agree that the initial submission represents a credible
      challenge to the central findings of the original paper, a full submission
      is invited; the initial submission is also sent to the authors of the
      original paper and they are given 14 days to submit a formal response
      (which may be shared with the authors of the challenge at some stage in
      the process). If the initial submission does not represent a credible
      challenge to the original paper, it is declined.
    </Paragraph.Reading>

    <Paragraph.Reading>
      Once any response has been received, the Editors discuss the challenge and
      the response, and then decide between the following options: accept both
      for publication; accept the challenge but reject the response; reject
      both; proceed with peer review of one or both manuscripts; take another
      course of action.
    </Paragraph.Reading>

    <Paragraph.Reading>
      If the Editors opt for peer review, the following outcomes are possible:
      the challenge and the response are both accepted; the challenge is
      accepted but the response is rejected; the challenge is rejected (which
      means there is no need to publish the response). Please note the
      manuscripts will typically be accepted or rejected at this stage of the
      process; revised manuscripts will not usually be requested.
    </Paragraph.Reading>

    <Paragraph.Reading>
      Full submissions and formal responses should not usually exceed 1,500
      words in the main text, excluding the Materials and methods, References,
      and Figure legends, and should have no more than four main display items
      (figures, tables, videos). Authors should follow the format for Research
      Articles or Short Reports, as appropriate; the Results and/or Discussion
      section should contain separate subsections for each element of the
      challenge. Both the challenge and the response can contain original data.
    </Paragraph.Reading>

    <Paragraph.Reading>
      While priority is given to manuscripts that challenge eLife papers, we
      will also consider important submissions that challenge papers published
      elsewhere. As described above, the author must contact the corresponding
      author of the original paper in an effort to resolve matters (and include
      evidence of these efforts in their initial submission), and the Scientific
      Correspondence must be submitted within a year of the original paper being
      published.
    </Paragraph.Reading>

    <CalloutTextBox>
      <Paragraph.Reading>
        Authors submitting a Research Article, Short Report, Tools and Resources
        Article, or Scientific Correspondence are encouraged to read about the{' '}
        <Link to="/author-guide/initial">Initial Submission</Link> process.
        Authors of Research Advances can proceed to the{' '}
        <Link to="/author-guide/full">Full Submission</Link> section.
      </Paragraph.Reading>
    </CalloutTextBox>

<h2>Special Issues</h2>

<Paragraph.Reading>
  eLife has Special Issues on timely and important topics, which are overseen by one 
  or more eLife editors and external Guest Editors when appropriate. 
  </Paragraph.Reading>

<Paragraph.Reading>
    At the point of submission, authors should indicate in their Cover Letter that they 
    want their work to be considered as part of a Special Issue, citing the relevant title 
    as indicated below. Submissions are assessed using the same criteria as other eLife 
    submissions. Authors can submit using the Research Articles, Short Reports, Tools and 
    Resources and Research Advances article types. The eLife editors may wish to commission 
    Review Articles as part of a Special Issue.
    </Paragraph.Reading>

<Paragraph.Reading>
      We welcome submissions on a rolling basis, although submissions received after the closing 
      date of a call for papers may not be considered for the Special Issue launch.
      </Paragraph.Reading>

<Paragraph.Reading>
        Special Issues open for submissions:
          <List.Unordered>
            <li>
            <NativeLink href="https://elifesciences.org/inside-elife/d81c2cd9/special-issue-call-for-papers-at-the-interface-of-cancer-biology-and-immunology"
target="_blank">
  Discovery and Translation of Cancer Immunology
  </NativeLink>
            </li>
            </List.Unordered>
        </Paragraph.Reading>
<Paragraph.Reading>
        Other Special Issues (submissions welcome on a rolling basis):
          <List.Unordered>
            <li>
            <NativeLink href="https://elifesciences.org/collections/e8dda407/mechanistic-microbiome-studies-a-special-issue"
target="_blank">
  Mechanistic Microbiome Studies 
  </NativeLink>
            </li>
            </List.Unordered>
        </Paragraph.Reading>
  </React.Fragment>
)

export default Types
