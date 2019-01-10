import React from 'react'
import { H1, H2, Link } from '@pubsweet/ui'

import Paragraph from '../../../ui/atoms/Paragraph'
import NativeLink from '../../../ui/atoms/NativeLink'
import List from '../../../ui/atoms/List'

const Full = props => (
  <React.Fragment>
    <H1>Full Submissions</H1>

    <Paragraph.Reading>
      If an author is invited to submit a Full Submission, they will receive a
      link to the article submission system, which will take them to a page
      incorporating existing information about their Initial Submission. The
      corresponding author is then required to build on the existing information
      to support the peer-review process. Once the full submission is complete,
      all co-authors will be contacted to verify their authorship, contribution,
      and competing interest statements. Please note that Research Advances
      bypass the Initial Submission step.
    </Paragraph.Reading>

    <H2>Submission Files</H2>

    <Paragraph.Reading>
      At this point, authors can either upload another single PDF of their
      manuscript (with the text and figures combined), or they can upload the
      source files separately if they prefer.
    </Paragraph.Reading>

    <Paragraph.Reading>
      Either way, authors are strongly encouraged to think creatively about the
      presentation of their work, to take advantage of the flexibility and file
      formats eLife offers, and to keep the article as concise as possible. To
      assist the review process, please organise and format the manuscript so
      that it is easily readable. Please include page and line numbers, double
      spacing, and a legible font size for the main text and figure legends.
    </Paragraph.Reading>

    <Paragraph.Reading>
      Regarding the use of supplementary data, our vision is presented in{' '}
      <NativeLink
        href="https://elifesciences.org/inside-elife/6f32c567/supplementary-data"
        target="_blank"
      >
        this blog post
      </NativeLink>
      . In short, we strive to make supplementary data, if applicable, easily
      searchable, discoverable, and citable, and made available in the most
      useful format for reuse.
    </Paragraph.Reading>

    <List.Ordered>
      <li>
        <strong>eLife Transparent Reporting Form: </strong>
        <Paragraph.Reading>
          To facilitate the interpretation and replication of experiments,
          authors should, where appropriate, provide detailed information in
          areas relating to sample-size estimation, replicates, and statistical
          reporting. At the Full Submission step, authors should be ready to
          upload a completed version of this form (
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
          ), which should describe the places within the submission where this
          information has been included.
        </Paragraph.Reading>
        <Paragraph.Reading>
          Please note that we publish the completed Transparent Reporting Form
          for submissions accepted for publication. This will be available to
          download as a supplementary file in the format provided by the
          authors.
        </Paragraph.Reading>
      </li>

      <li>
        <strong>Figures and Figure Supplements: </strong>
        <Paragraph.Reading>
          eLife does not have space or printing constraints, so any number of
          colour figures can be included within Research Articles, although we
          urge authors to present their results as concisely as possible. Short
          Reports should not contain more than three or four display items. We
          also recognise that some figures are more central to the narrative of
          the paper than others, and so we therefore support ‘child’ figures
          (examples of which can be found in{' '}
          <NativeLink
            href="http://elifesciences.org/content/1/e00181#F3"
            traget="_blank"
          >
            eLife 2012;1:e00181
          </NativeLink>
          ). These &quot;Figure Supplements&quot; must be linked to one of the
          primary figures: they can, for example, provide additional examples of
          analyses or data shown in a primary figure.
        </Paragraph.Reading>
        <Paragraph.Reading>
          There is no limit on the number of Figure Supplements for any one
          primary figure. Each figure supplement should be clearly labelled,
          Figure 1–figure supplement 1, Figure 1–figure supplement 2, Figure
          2–figure supplement 1 and so on, and have a short title (and optional
          legend). Figure Supplements should be referred to in the legend of the
          associated primary figure, and should also be listed at the end of the
          article text file.
        </Paragraph.Reading>
        <Paragraph.Reading>
          Authors should provide information about data processing and analysis
          in their figure legends, including any statistical tests applied, with
          exact sample number, p values of tests, criteria for data inclusion or
          exclusion, and details of replicates. In some cases, it might be
          unwieldy to have this information in the legend of a figure, in which
          case the information can be provided in a source data file – see
          below.
        </Paragraph.Reading>
        <Paragraph.Reading>
          Although we understand that authors sometimes need to provide
          composite figures as main figures, we urge authors not to make such
          figures (and their legends) too large to avoid the figure and its
          legend extending beyond one page in the PDF. We also encourage authors
          to avoid composite figure supplements wherever possible.
        </Paragraph.Reading>
        <Paragraph.Reading>
          When preparing figures, we recommend that authors follow the
          principles of{' '}
          <NativeLink
            href="http://jfly.iam.u-tokyo.ac.jp/color/"
            target="_blank"
          >
            Colour Universal Design
          </NativeLink>{' '}
          (Masataka, Okabe and Kei Ito, J*Fly), whereby colour schemes are
          chosen to ensure maximum accessibility for all types of colour vision.
        </Paragraph.Reading>
        <Paragraph.Reading>
          Figures can be uploaded individually in the following formats: TIFF,
          GIF, JPG, EPS, AI, PDF and Corel Draw. If you would like to supply PDF
          images please ensure that they are saved in a Vector image format.
        </Paragraph.Reading>
      </li>

      <li>
        <strong>Source Data Files, for Figures and Tables: </strong>
        <Paragraph.Reading>
          eLife encourages authors to provide Source Data files, for example,
          for figures such as histograms or tables showing summary data (as
          shown in{' '}
          <NativeLink
            href="http://elifesciences.org/content/1/e00109/#DC1"
            target="_blank"
          >
            eLife 2012;1:e00109
          </NativeLink>
          ). Each Source data file should relate directly to a single figure or
          table, whereas major datasets generated in the course of the work
          should be deposited externally, as explained below. Each source data
          file should be clearly labelled, &apos;Figure 1–Source Data 1&apos;,
          &apos;Table 1–Source Data 1&apos; and so on, and have a short title
          (and optional legend). Source data files should be referred to in the
          relevant figure legend or table footnote, and they should also be
          listed at the end of the article text file.
        </Paragraph.Reading>
        <Paragraph.Reading>
          In addition, authors should provide information about data processing
          and analysis, including any statistical tests applied, with exact
          sample number, p values of tests, criteria for data inclusion or
          exclusion, and details of replicates. In some cases, it might be
          unwieldy to have this information in the legend of a figure, in which
          case the information should be provided along with the source data
          file.
        </Paragraph.Reading>
      </li>

      <li>
        <strong>Rich Media Files: </strong>
        <Paragraph.Reading>
          Rich media files encompass forms of presentation that go beyond static
          presentation: for example, videos, audio clips, animations,
          slideshows, and interactive diagrams. Rich media files should be
          supplied as AVI, WMV, MOV, MP4, or H264. Where an audio track is
          present, we recommend a sampling rate of 44100, 22050, or 11025 Hz to
          avoid encoding and quality issues. Each file should be accompanied by
          a concise title/legend at the end of the article file. If the article
          is published, videos are embedded within the main body of the article
          (they are not presented as supplementary files) with the same status
          as primary figures (as shown in{' '}
          <NativeLink
            href="http://elifesciences.org/content/1/e00007#media-1"
            target="_blank"
          >
            eLife 2012;1:e00007
          </NativeLink>
          ).
        </Paragraph.Reading>
        <Paragraph.Reading>
          eLife supports JMOL, a Java viewer for three-dimensional chemical
          structures, and we encourage authors to provide{' '}
          <NativeLink
            href="http://wiki.jmol.org/index.php/File_formats/Coordinates"
            target="_blank"
          >
            compatible files
          </NativeLink>
          .
        </Paragraph.Reading>
      </li>

      <li>
        <strong>Source Code: </strong>
        <Paragraph.Reading>
          Relevant software or source code should be deposited in an open
          software archive. Where appropriate, authors can upload source code
          files to the submission system (for example, MATLAB, R, Python, C,
          C++, Java). Any code provided should be properly documented, in line
          with{' '}
          <NativeLink
            href="http://journals.plos.org/ploscompbiol/s/materials-and-software-sharing#loc-sharing-software"
            target="_blank"
          >
            these instructions
          </NativeLink>{' '}
          (courtesy of PLOS). Please also refer to our{' '}
          <Link to="/author-guide/journal-policies">
            Software sharing policy
          </Link>
          .
        </Paragraph.Reading>
      </li>

      <li>
        <strong>Reporting Standards Documents: </strong>
        <Paragraph.Reading>
          eLife encourages authors to upload any relevant reporting standards
          documents.
        </Paragraph.Reading>
      </li>

      <li>
        <strong>Supplementary Files: </strong>
        <Paragraph.Reading>
          Authors are discouraged from uploading large PDFs of data and/or text
          as supplementary files for the reasons explained above. However,
          information not central to the narrative, that falls outside of the
          other formats specified above, such as long lists of strains or
          plasmids, are welcome as supplementary files, provided they are
          uploaded in the most useful format. Supplementary files, if provided,
          should be labelled as Supplementary File 1, Supplementary File 2 and
          so on, and have a title (and optional legend). Supplementary files
          should be listed at the end of the article file.
        </Paragraph.Reading>
      </li>

      <li>
        <strong>Related Manuscripts: </strong>
        <Paragraph.Reading>
          Any related manuscripts should be described in the cover letter and
          uploaded using the Related Manuscript file type.
        </Paragraph.Reading>
      </li>
    </List.Ordered>

    <H2>Submission Metadata</H2>

    <Paragraph.Reading>
      The Full Submission requires additional information about the article and
      all authors. This allows eLife to propagate published content to a wide
      range of resources and indexes, so that accepted articles are widely
      discoverable and can be used by the broadest possible audience. During the
      full submission process, the corresponding author will also be asked to
      link their existing ORCID record to their eLife profile, or create an
      ORCID record, if he or she does not already have one. An ORCID iD is a
      unique and persistent digital identifier that distinguishes you from other
      researchers and reliably connects you with your research contributions and
      affiliations, to help ensure that your work is properly attributed and
      credited (
      <NativeLink
        href="https://elifesciences.org/inside-elife/e2bf15ca/publishers-to-require-orcid-identifiers-for-authors"
        target="_blank"
      >
        learn more
      </NativeLink>
      ).
    </Paragraph.Reading>

    <List.Ordered>
      <li>
        <strong>Impact Statement: </strong>
        <Paragraph.Reading>
          The impact statement is single sentence (typically 15-30 words) that
          summarises the most important finding of the work: it needs to
          complement (rather than repeat) the title, and should avoid acronyms
          that are not well known to a broad readership. It also needs to be
          written in third-person (i.e., it should not use “we” or “our”).
        </Paragraph.Reading>
      </li>

      <li>
        <strong>Complete Author Information: </strong>
        <Paragraph.Reading>
          Co-author details should be entered: in addition to the full author
          name and affiliation (department, institution, city, and country), a
          competing interests statement is required for each author. All
          financial and non-financial competing interests that could reasonably
          be perceived to be relevant to the work should be declared.
        </Paragraph.Reading>
        <Paragraph.Reading>
          Information about individual author contributions should be provided
          using the Contributor Roles Taxonomy: Conceptualization; Methodology;
          Software; Validation; Formal analysis; Investigation; Resources; Data
          curation; Writing – original draft preparation; Writing – review &amp;
          editing; Visualization; Supervision; Project administration; Funding
          acquisition (
          <NativeLink
            href="https://elifesciences.org/inside-elife/f39cfcf5/enabling-the-contributor-roles-taxonomy-for-author-contributions?_ga=2.172472675.1994204094.1499675694-1424042520.1478607646"
            target="_blank"
          >
            read more
          </NativeLink>
          ).
        </Paragraph.Reading>
        <Paragraph.Reading>
          During the Full Submission process, an email is sent to all authors to
          confirm that they approve of the submission of the manuscript, its
          content, authorship, and the order of authorship. It is also possible
          to indicate joint first authorship during the submission process.
        </Paragraph.Reading>
        <Paragraph.Reading>
          If one or more author groups or consortia are indicated as authors, to
          ensure that individual collaborators are searchable on resources such
          as PubMed, please provide the list of collaborators in an Excel file
          (uploaded as file type Collaborators). Please ensure given names and
          surnames are listed in separate columns per collaborator. They will be
          listed under the acknowledgements on publication.
        </Paragraph.Reading>
      </li>

      <li>
        <strong>Funding: </strong>
        <Paragraph.Reading>
          In addition to a list of the sources of funding, authors are also
          expected to provide the relevant grant numbers, where possible, and
          list the authors associated with the specific funding sources. Please
          do not include information about direct funding in the
          acknowledgements to avoid duplication.
        </Paragraph.Reading>
        <Paragraph.Reading>
          Authors are also required to state whether the funding sources were
          involved in study design, data collection and interpretation, or the
          decision to submit the work for publication.
        </Paragraph.Reading>
      </li>

      <li>
        <strong>Datasets: </strong>
        <Paragraph.Reading>
          All datasets used in a publication should be cited in the text and
          listed in the reference section and/or data availability statement.
          References for data sets and program code should include a persistent
          identifier, for example a Digital Object Identifier (DOI) or accession
          number.
        </Paragraph.Reading>
        <Paragraph.Reading>
          In the submission form, authors should provide the following
          information about newly generated and previously published datasets in
          the following format: Author(s), Year, Dataset Title, Dataset ID
          and/or URL, Database, License and Accessibility Information. This
          information will be used to create a list of the relevant major
          datasets in the published article (such as{' '}
          <NativeLink
            href="http://elifesciences.org/content/1/e00070/article-data"
            target="_blank"
          >
            eLife 2012;1:e00070
          </NativeLink>
          ), to indicate their location along with unique identifiers, and
          licensing information – or any other factors – affecting access to or
          reuse of the datasets. For newly generated datasets, we encourage the
          use of the Creative Commons{' '}
          <NativeLink
            href="https://creativecommons.org/publicdomain/zero/1.0/"
            target="_blank"
          >
            CC0 public domain dedication
          </NativeLink>
          .
        </Paragraph.Reading>
        <Paragraph.Reading>
          Where appropriate, data analysis tools should also be made available
          to assist interested researchers in the manipulation and use of the
          data.
        </Paragraph.Reading>
      </li>

      <li>
        <strong>
          Ethics Statement for Human Subjects Research or Animal
          Experimentation:{' '}
        </strong>
        <Paragraph.Reading>
          Authors are required to provide an ethics statement during submission
          to indicate the institutional review board or ethics committee that
          has approved the study and/or the guidelines that have been followed.
        </Paragraph.Reading>
      </li>

      <li>
        <strong>Editor and Reviewer Suggestions/Exclusions: </strong>
        <Paragraph.Reading>
          We request that authors provide suggestions for at least four
          potential reviewers of the work. To encourage diversity, please
          consider specifically suggesting reviewers at an early stage of their
          career, women, and experts from places other than USA and Europe.
          Please do not list colleagues who are close associates, collaborators,
          or family members. Authors may also provide the names of reviewers or
          editors who they would prefer to exclude from the assessment of the
          article. We will make every effort to follow author requests for
          excluded individuals unless the editors judge that such exclusion
          would interfere with the rigorous assessment of the work.
        </Paragraph.Reading>
      </li>
    </List.Ordered>

    <Paragraph.Reading>
      If your Full Submission has been peer reviewed and you have been asked to
      make revisions, please review our guidelines for{' '}
      <Link to="author-guide/revised">Revised Submissions</Link>.
    </Paragraph.Reading>
  </React.Fragment>
)

export default Full
