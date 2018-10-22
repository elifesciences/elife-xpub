import React from 'react'
import { H1, H2 } from '@pubsweet/ui'

import Paragraph from '../../ui/atoms/Paragraph'
import ExternalLink from '../../ui/atoms/ExternalLink'
import List from '../../ui/atoms/List'

const WritingTheReview = props => (
  <React.Fragment>
    <H1>Writing the Review</H1>

    <H2>Article Selection Criteria</H2>

    <Paragraph>
      eLife’s{' '}
      <ExternalLink
        href="http://elifesciences.org/about#aims-and-scope"
        target="_blank"
      >
        scope
      </ExternalLink>{' '}
      is broad and inclusive, covering the full range of biomedical and life
      science research, from the most basic and theoretical work through to
      translational, applied and clinical research. We seek to publish all
      highly influential research in these fields, whereby influence is
      interpreted in the broadest sense to cover the advance in understanding,
      potential to drive a field forward, and real-world outcomes. Articles must
      be methodologically and scientifically rigorous, ethically conducted, and
      objectively presented according to the appropriate community standards.
    </Paragraph>

    <H2>Your Review</H2>

    <Paragraph>
      You will be asked for a general assessment and a summary of any
      substantive concerns (ideally in fewer than 500 words but longer reviews
      can also be submitted), and a list of minor comments. If you want to state
      that something is already known, and either contradicts or duplicates a
      major conclusion of the manuscript, please support this with appropriate
      references. When constructing your comments, you should follow these
      important eLife editorial principles and justify any requests for
      additional work:
    </Paragraph>

    <List.Ordered>
      <li>
        We will only request new work, such as experiments, analyses, or data
        collection, if the new data are essential to support the major
        conclusions.
      </li>
      <li>
        The authors must be able to do any new work in a reasonable time frame
        (additional work should be conducted and written up within two months).
        If the conclusions are not adequately supported by the existing data,
        the submission should be rejected.
      </li>
      <li>
        Any requests for new work must fall within the scope of the current
        submission and the technical expertise of the authors.
      </li>
    </List.Ordered>

    <Paragraph>
      When revisions are requested, the Reviewing Editor’s decision letter will
      only contain the most relevant review comments, with any subsequent
      resubmission assessed only by the original Reviewing Editor in most cases.
      These principles are intended to accelerate scientific progress by
      promoting modes of communication whereby new results are made available
      quickly, openly, and in a way that helps others to build upon them.
    </Paragraph>

    <Paragraph>
      In the interests of transparency and reproducibility, eLife asks authors
      to complete our transparent reporting form with information relating to
      sample-size estimation, replicates, and statistical reporting. The form is
      available to download and consider alongside the other manuscript files.
    </Paragraph>

    <Paragraph>
      eLife is a member of the Committee on Publication Ethics (COPE), supports
      their principles, and follows their flowcharts for dealing with potential
      breaches of{' '}
      <ExternalLink href="author-guide/journal-policies" target="_blank">
        publishing ethics
      </ExternalLink>
      . Reviewers are asked not make allegations of misconduct within the review
      itself or within the online consultation, but in the event of concerns
      about potential plagiarism, inappropriate image manipulation, or other
      forms of misconduct, reviewers should alert the journal’s editorial staff
      in the first instance. The editorial staff will consult the Senior Editor
      and Reviewing Editor, and consider the concerns further.
    </Paragraph>

    <H2>Submitting the Review</H2>

    <Paragraph>
      You will be asked to confirm that you do not have any competing interests
      to declare; that you disclose the name(s) of anybody with whom you have
      discussed the article, or who has assisted in the review process
      (including co-reviewing for training purposes); whether you want to remain
      anonymous; and whether you agree to allow us to share your full review and
      identity with other journals in the event of rejection.
    </Paragraph>

    <Paragraph>
      The main part of the review consists of a general assessment and a summary
      of any substantive concerns (in fewer than 500 words), and a list of minor
      comments. Please be aware that in the event of acceptance, the decision
      letter containing the integrated review comments will be published
      (subject to author approval).
    </Paragraph>
  </React.Fragment>
)

export default WritingTheReview
