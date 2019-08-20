import React from 'react'
import { H1, H2, H3, Link } from '@pubsweet/ui'

import {
  Paragraph,
  NativeLink,
} from '@elifesciences/component-elife-ui/client/atoms'

const Revised = props => (
  <React.Fragment>
    <H1>Revised Submissions</H1>

    <H2>Response to the Decision Letter After Peer Review</H2>

    <Paragraph.Reading>
      Authors should provide a response to the decision letter, responding
      point-by-point. If the paper is accepted, responses to any major concerns
      will be published, so please upload an editable file wherever possible.
    </Paragraph.Reading>

    <H2>Source Manuscript Files</H2>

    <Paragraph.Reading>
      If source manuscript files have not already been provided, we will need
      them at the revision stage.
    </Paragraph.Reading>

    <H3>Article Text File and Tables</H3>

    <Paragraph.Reading>
      The text file, with any main tables at the end, should be uploaded as a
      DOCX (or DOC or RTF) file, or as a LaTeX file (ideally using our{' '}
      <NativeLink
        href="https://cdn.elifesciences.org/author-guide/elife-latex-template.zip"
        target="_blank"
      >
        LaTeX template
      </NativeLink>
      ). The uploaded Article File should include tracked changes indicating the
      revisions made, ideally using the tracked changes function in Word. (If
      you prefer to indicate textual changes in another way, for example with
      coloured text, this version should instead be uploaded as a Related
      Manuscript file, with a clean version of the text file uploaded as the
      Article File.)
    </Paragraph.Reading>

    <Paragraph.Reading>
      Where article files are supplied in LaTex format, the associated
      bibliography (.bib) file must be provided along with any accompanying
      style (.bst) file. If specific style packages (.sty) are used for the main
      article, these should also be provided. All .bib, .bst, and .sty files
      should be uploaded as related manuscript files. LaTeX code uploaded to our
      submission system cannot make use of packages such as subfig or subcaption
      at the moment, so all figures with panels must be collected into single
      figure files prior to upload. If authors intend to select the option to
      have the accepted version of their article published, it will be useful if
      the typeset PDF of the article is uploaded as well.
    </Paragraph.Reading>

    <Paragraph.Reading>
      Please also make sure to include information in your manuscript related to
      the use of cell lines, animal or human experimentation and data and
      software availability, as indicated in our{' '}
      <Link to="/author-guide/journal-policies">Journal Policies</Link>.
    </Paragraph.Reading>

    <H3>Key Resources Table</H3>

    <Paragraph.Reading>
      Where appropriate, and especially for studies including bench research,
      authors should incorporate a Key Resources Table within their
      resubmission. This is designed to highlight genetically modified organisms
      and strains, cell lines, reagents, and software that are essential to
      reproduce the results presented. Please download and complete{' '}
      <NativeLink
        href="https://elife-cdn.s3.amazonaws.com/author-guide/elifeKRTtemplatev2.docx"
        target="_blank"
      >
        this template
      </NativeLink>{' '}
      for the Key Resources Table to ensure consistency. The template is a
      resource developed by FlyBase with input from other model organism
      databases, and it includes notes on completion and an example table. The
      completed Key Resources Table should be incorporated within your article
      file at the very beginning of the Materials and Methods section (
      <NativeLink
        href="https://elifesciences.org/articles/32586#s4"
        target="_blank"
      >
        example in published article available here
      </NativeLink>
      ).
    </Paragraph.Reading>

    <H3>Figures and Figure Supplements</H3>

    <Paragraph.Reading>
      Each figure and each figure supplement should be uploaded as an individual
      file: each image should be labelled Figure 1, Figure 2, and so on. Figures
      and figure supplements can be uploaded in the following formats: TIFF,
      GIF, JPG, EPS, AI, PDF and Corel Draw.
    </Paragraph.Reading>

    <Paragraph.Reading>
      All figures must be uploaded at a minimum dpi of 300 and a minimum
      physical width size of 10cm. If you anticipate any figures being the
      equivalent width of a full typeset page, they must be uploaded at a
      minimum physical width of 20cm and remain at 300 dpi.
    </Paragraph.Reading>

    <Paragraph.Reading>
      At the revised submission stage, please ensure that whitespace around
      figures is minimised, especially in PDF images.
    </Paragraph.Reading>

    <Paragraph.Reading>
      Figures in revised manuscripts may be screened to ensure that they have
      not been adjusted in any way that could lead to misinterpretation of the
      information present in the original image.
    </Paragraph.Reading>

    <H2>eLife Digest</H2>

    <Paragraph.Reading>
      Most eLife papers include a plain-language summary (called an eLife
      digest) that explains the background and central findings of the work to a
      broad readership. When an author has been asked to revise a full
      submission, a member of the Features Team will make contact to ask if the
      author would like to include a digest in their paper. Digests are
      typically between 200 and 400 words long.
    </Paragraph.Reading>

    <H2>Striking Image</H2>

    <Paragraph.Reading>
      Authors are encouraged to provide a striking image (preferably in colour)
      that we can use to highlight the article if it is published. Images should
      be in landscape format, and be at least 1800 pixels wide if possible: png,
      tiff or jpeg formats are preferred. Images should not include labels
      and/or text. These files must be available to use under the terms of the
      Creative Commons Attribution license. Please upload these images using the
      Potential Striking Image file type, and please include a short caption
      that explains what is shown in the striking image.
    </Paragraph.Reading>

    <Paragraph.Reading>
      For information about acceptance, rejection, and appeals, please proceed
      to the <Link to="/author-guide/post">Post Decision</Link> section.
    </Paragraph.Reading>
  </React.Fragment>
)

export default Revised
