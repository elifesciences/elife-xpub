import React from 'react'
import { H1, H2, H3 } from '@pubsweet/ui'

import Paragraph from '@elifesciences/component-elife-ui/client/atoms/Paragraph'
import NativeLink from '@elifesciences/component-elife-ui/client/atoms/NativeLink'
import List from '../../components/List'

const Post = props => (
  <React.Fragment>
    <H1>Post Decision</H1>

    <H2>Acceptance</H2>

    <Paragraph.Reading>
      eLife is an open-access journal: articles are distributed under the terms
      of the{' '}
      <NativeLink
        href="http://creativecommons.org/licenses/by/4.0/"
        target="_blank"
      >
        Creative Commons Attribution License
      </NativeLink>{' '}
      (except where otherwise noted), which permits unrestricted use and
      redistribution provided that the original author and source are credited,
      in line with the{' '}
      <NativeLink
        href="http://www.budapestopenaccessinitiative.org/read"
        target="_blank"
      >
        BOAI definition of open access
      </NativeLink>
      .
    </Paragraph.Reading>

    <H3>Detailed Protocols</H3>

    <Paragraph.Reading>
      If your paper involves a method that would also benefit from the
      publication of a step-by-step protocol (e.g.,{' '}
      <NativeLink href="http://bio-protocol.org/e1067" target="_blank">
        http://bio-protocol.org/e1067
      </NativeLink>
      ), we would encourage you to consider{' '}
      <NativeLink href="http://www.bio-protocol.org/" target="_blank">
        Bio-protocol
      </NativeLink>
      , which curates high-quality life science protocols, or{' '}
      <NativeLink href="https://www.protocols.io/" target="_blank">
        protocols.io
      </NativeLink>
      , which is an open-access repository of science methods.
    </Paragraph.Reading>

    <List.Unordered>
      <li>
        For a submission to Bio-protocol (these are subject to peer review),
        please refer to their{' '}
        <NativeLink
          href="http://www.bio-protocol.org/Protocol_Preparation_Guidelines.aspx"
          target="_blank"
        >
          guidelines
        </NativeLink>{' '}
        and then submit the protocol using{' '}
        <NativeLink
          href="http://www.bio-protocol.org/login.aspx?in=2%20"
          target="_blank"
        >
          this link
        </NativeLink>
        .
      </li>
      <li>
        For a submission to{' '}
        <NativeLink href="https://www.protocols.io/" target="_blank">
          protocols.io
        </NativeLink>
        , after describing the step-by-step protocol, select “Get DOI” to obtain
        a persistent digital object identifier, which should be included within
        the Materials and Methods section of your manuscript, using this format:
        https://dx.doi.org/10.17504/protocols.io.[xxxxxx]. Initially the
        protocol is only visible to those with the link, but you can make the
        protocol public by selecting “Publish” from the protocols.io site.
      </li>
    </List.Unordered>

    <H3>Publication of the Accepted Manuscript</H3>

    <Paragraph.Reading>
      To ensure that new research is made available as rapidly as possible,
      eLife offers an{' '}
      <NativeLink
        href="http://elifesciences.org/elife-news/picking-up-speed"
        target="_blank"
      >
        optional service to authors
      </NativeLink>{' '}
      whereby a PDF of their accepted manuscript can be published within a few
      days of acceptance.
    </Paragraph.Reading>

    <Paragraph.Reading>
      Accepted manuscripts are citable, have a DOI, are listed in PubMed, and
      are available to download from eLife’s upcoming, browse, and archive
      pages.
    </Paragraph.Reading>

    <Paragraph.Reading>
      The main figures and tables of the accepted manuscript are available at
      the end of the PDF. Additional items such as videos, figure supplements,
      and source data files are available to download as a separate zip file.
    </Paragraph.Reading>

    <Paragraph.Reading>
      Authors are invited to opt-in to this service when submitting a revised
      manuscript. In the event that the study has potentially broad public
      significance, we recommend that authors consult their institutional press
      officer before choosing to publish the accepted manuscript.
    </Paragraph.Reading>

    <H3>Publication of the Final Version</H3>

    <Paragraph.Reading>
      The final version of the accepted article will be published, along with
      the decision letter incorporating the review comments and the authors’
      response to those comments (as in{' '}
      <NativeLink
        href="http://elifesciences.org/content/1/e00109/#decision-letter"
        target="_blank"
      >
        eLife 2012;1:e00109
      </NativeLink>
      ). If authors have any questions or concerns about the content of the
      decision letter after peer review, or their response to this letter, it is
      important to notify the journal office as soon as possible.
    </Paragraph.Reading>

    <Paragraph.Reading>
      The corresponding author will have an opportunity to review a proof of the
      article in HTML format prior to publication. Authors will have 48 hours to
      answer queries generated during the production process. Changes should be
      limited to essential corrections.
    </Paragraph.Reading>

    <H2>Corrections to Published Articles</H2>

    <Paragraph.Reading>
      Publishers have a responsibility to correct errors that have been
      discovered in published articles. Requests for corrections or retractions
      should be sent to the journal’s editorial staff for consideration and
      further advice.
    </Paragraph.Reading>

    <Paragraph.Reading>
      Corrections are limited to those that will affect the scientific integrity
      of the content.
    </Paragraph.Reading>

    <Paragraph.Reading>
      In the rare instance that there is a substantive error that requires a
      correction to an accepted manuscript before the final version is
      published, a second version of the accepted manuscript will be published.
      The first version will still be accessible and a description of the
      correction(s) will be included as a footnote within the PDF of the new
      version. A description of the correction(s) will also be added as a
      comment online.
    </Paragraph.Reading>

    <Paragraph.Reading>
      Once the final version of record is published, a formal correction would
      need to be issued for any further changes. Formal corrections are
      published on the eLife website, with links to a corrected version of the
      relevant article. The previous version of the article is replaced and the
      published correction provides a clear record of the change. We will
      transmit corrections to PubMed Central and PubMed as well as other
      relevant indexes and repositories, although some services will not be able
      to present the correction or replace the content. If you have any concerns
      about a correction, please contact the editorial staff.
    </Paragraph.Reading>

    <H2>Rejection</H2>

    <H3>Using eLife peer reviews when submitting to another journal</H3>

    <Paragraph.Reading>
      Because we are committed to improving the overall efficiency of the
      publishing process, we are willing to share referee reports and identities
      (where they agree) with another journal of the corresponding author’s
      choice. As an example of what others have done, we have facilitated the
      transfer of review material to a range of journals, including{' '}
      <NativeLink
        href="http://www.biologists.com/biology-open/transfer-to-biology-open-from-elife/"
        target="_blank"
      >
        Biology Open
      </NativeLink>{' '}
      (which offers the option to upload the manuscript files on the
      corresponding author’s behalf),{' '}
      <NativeLink href="https://bmcbiol.biomedcentral.com/" target="_blank">
        BMC Biology
      </NativeLink>
      ,{' '}
      <NativeLink href="http://embor.embopress.org/" target="_blank">
        EMBO Reports
      </NativeLink>
      ,{' '}
      <NativeLink href="http://www.eneuro.org/ " target="_blank">
        eNeuro
      </NativeLink>
      , the{' '}
      <NativeLink
        href="https://www.plos.org/which-journal-is-right-for-me"
        target="_blank"
      >
        PLOS journals
      </NativeLink>
      , the{' '}
      <NativeLink href="http://jcb.rupress.org/" target="_blank">
        Journal of Cell Biology
      </NativeLink>
      , and the{' '}
      <NativeLink href="http://jgp.rupress.org/" target="_blank">
        Journal of General Physiology
      </NativeLink>
      . We encourage authors of neuroscience submissions to consider re-using
      reviews with other members of the{' '}
      <NativeLink
        href="http://nprc.incf.org/index.php/about/information-for-authors/"
        target="_blank"
      >
        Neuroscience Peer Review Consortium
      </NativeLink>
      .
    </Paragraph.Reading>

    <Paragraph.Reading>
      In the event that an article is rejected after peer review, we ask
      permission from the reviewers to pass on their full review and identity to
      another journal, so that authors can request that the peer-review
      information is passed along confidentially. We will inform the reviewers
      if such a transfer is made. For reviews to be passed to another journal
      within the Neuroscience Peer Review Consortium please email us (editorial
      [at] elifesciences.org) and ask that the reviews be forwarded, stating the
      name and manuscript ID at the next journal. For other journals, authors
      should indicate that their work was previously reviewed by eLife in their
      cover letter and request that the editors contact eLife (editorial [at]
      elifesciences.org) to request the referee reports and identities. When
      authors have made revisions, they should upload a response to the previous
      reviews alongside their manuscript.
    </Paragraph.Reading>

    <H3>Appeals</H3>

    <Paragraph.Reading>
      If authors feel that their article has been erroneously rejected by eLife,
      they should contact the editorial office. Appeals are first sent to the
      appropriate Senior editor for consideration.
    </Paragraph.Reading>
  </React.Fragment>
)

export default Post
