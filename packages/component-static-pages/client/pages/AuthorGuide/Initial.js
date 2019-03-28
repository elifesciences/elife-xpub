import React from 'react'
import { H1, H2, Link } from '@pubsweet/ui'

import Paragraph from '@elifesciences/component-elife-ui/client/atoms/Paragraph'
import NativeLink from '@elifesciences/component-elife-ui/client/atoms/NativeLink'
import List from '../../components/List'
import RequiredInfoTable from './RequiredInfoTable'

const Initial = props => (
  <React.Fragment>
    <H1>Initial submissions</H1>

    <H2>Single Manuscript PDF</H2>

    <Paragraph.Reading>
      Authors should start by uploading their manuscript text and figures as a
      single PDF (ideally smaller than 15MB), organised with easy readability in
      mind. Please include page and line numbers, and a legible font size for
      the main text and figure legends. We encourage authors to embed figures
      and tables at appropriate places within the main text.
    </Paragraph.Reading>

    <Paragraph.Reading>
      To facilitate the evaluation of the submission, we highly recommend
      including all authors for each reference in the reference list (e.g. John
      Smith, Anthony Murray and Peter Castle rather than John Smith et al.),
      although discretion can be used to truncate very long lists of authors.
    </Paragraph.Reading>

    <Paragraph.Reading>
      The manuscript should include the following components:
    </Paragraph.Reading>

    <List.Ordered>
      <li>
        <strong>Title: </strong>
        The title should ideally be fewer than 120 characters, with a clear
        indication of the biological system under investigation (if
        appropriate), and should avoid abbreviations and unfamiliar acronyms if
        possible. Please note that two-part titles – e.g. “What goes up must
        come down: Oscillations in transcriptional networks” – are not permitted
        for research papers.
      </li>
      <li>
        <strong>Author names and affiliations: </strong>A complete list of
        authors and affiliations should be provided in the paper itself.
      </li>
      <li>
        <strong>Abstract: </strong>
        The abstract should be fewer than 150 words and should not contain
        subheadings (except for papers following the CONSORT checklist). It
        should provide a clear, measured, and concise summary of the work. If
        the biological system (species names or broader taxonomic groups if
        appropriate) is not mentioned in the title, it must be included in the
        abstract.
      </li>
      <li>
        <strong>
          Introduction, Results, Discussion, Materials and Methods:{' '}
        </strong>
        <Paragraph.Reading>
          We encourage a clear and concise style of writing. Various writing
          guides are available, including Preparing a Manuscript for Submission
          to a Biomedical Journal (ICMJE) and The Elements of Style (New York:
          bartleby.com, 1999).
        </Paragraph.Reading>
        <Paragraph.Reading>
          Any &quot;personal communications&quot; relating to unpublished data
          should be incorporated within the main text, in the following format:
          (Author Initial(s) and Surname, personal communication, Month and
          Year). Authors should have permission from anyone named in this way
          and should be aware that a supporting letter will sometimes be
          requested.
        </Paragraph.Reading>
        <Paragraph.Reading>
          Within the Materials and Methods and/or figure legends, we encourage
          authors to provide complete information about their experiments,
          analyses, or data collection to ensure that readers can easily
          understand what was measured and analysed, and can accurately perform
          the relevant protocols.
        </Paragraph.Reading>
        <Paragraph.Reading>
          In cases where a new method within the submission would benefit from
          step-by-step protocols in addition to the methods described in the
          article, we would encourage authors to also consider submitting a
          detailed protocol to{' '}
          <NativeLink
            href="https://bio-protocol.org/login.aspx?in=2"
            target="_blank"
          >
            Bio-protocol
          </NativeLink>
          .
        </Paragraph.Reading>
        <Paragraph.Reading>
          On first mention, please provide details of any manufacturers in the
          following format: company name, city, country (or state, if based in
          the United States).
        </Paragraph.Reading>
      </li>
      <li>
        <strong>Acknowledgements: </strong>
        Individuals who have contributed materially to the work, but do not
        satisfy the authorship criteria should be listed in the acknowledgements
        section. Authors should seek permission to include any individuals
        mentioned in the acknowledgements.
      </li>
      <li>
        <strong>Competing interests: </strong>
        At this stage we request that the corresponding author provides a
        statement of financial and non-financial competing interests on behalf
        of all authors. Examples include paid employment or consultancy, stock
        ownership, patent applications, personal relationships with relevant
        individuals, and membership of an advisory board.
      </li>
      <li>
        <strong>References: </strong>
        <Paragraph.Reading>
          Accepted and published works, datasets (newly generated and previously
          published), program code, and previously published methods should be
          appropriately cited and included in the reference list to ensure that
          a wide range of research objects are afforded recognition through
          citation.
        </Paragraph.Reading>
        <Paragraph.Reading>
          Please find below the information we require for each type of
          reference. Please note, authors do not need to spend time formatting
          their references and can submit manuscripts formatted in a variety of
          reference styles, including Harvard, Vancouver, and Chicago. Wherever
          possible, please do not truncate the number of authors in the
          references list, but please do provide a DOI if possible.
        </Paragraph.Reading>
      </li>
    </List.Ordered>

    <RequiredInfoTable />

    <Paragraph.Reading>
      If using a reference manager, we suggest selecting APA style as this is
      the best match for eLife reference style. However, we accept any reference
      style and will format all references during the production process.
    </Paragraph.Reading>

    <H2>Figures, Tables, and Rich Media Files</H2>

    <Paragraph.Reading>
      Figures and tables should be included within the PDF. If authors already
      have a file available with the figures and tables embedded within the
      text, please provide this, but otherwise the figures and tables can be
      included at the end. Each figure and table should fit on one page,
      together with a title and concise legend (where appropriate), ideally on
      the same page as the display item. If this is not possible, titles and
      legends should be included at the end of the article file. Figures and
      tables should be numbered in the order in which they are cited in the
      text.
    </Paragraph.Reading>

    <Paragraph.Reading>
      We encourage the use of rich media files: for example, videos, audio
      clips, animations, slideshows, and interactive diagrams. Authors can
      upload such files during the Initial Submission process if they will
      assist in the initial assessment but otherwise they can be uploaded if a
      Full Submission is requested. Anything crucial for the initial evaluation
      should be uploaded at the Initial Submission stage as a supporting file.
    </Paragraph.Reading>

    <Paragraph.Reading>
      At this stage, supplementary figures and tables can be included if they
      exist, and if desired, within the single PDF.
    </Paragraph.Reading>

    <Paragraph.Reading>
      When preparing figures, we recommend that authors follow the principles of{' '}
      <NativeLink href="http://jfly.iam.u-tokyo.ac.jp/color/" target="_blank">
        Colour Universal Design
      </NativeLink>{' '}
      (Masataka Okabe and Kei Ito, J*FLY), whereby colour schemes are chosen to
      ensure maximum accessibility for all types of colour vision.
    </Paragraph.Reading>

    <Paragraph.Reading>
      When preparing coloured tables, authors should note that we can only
      accomodate schemes as outlined in{' '}
      <NativeLink
        href="https://cdn.elifesciences.org/author-guide/tables-colour.pdf?_ga=2.122882312.2069272108.1540132848-2034406101.1537543708"
        target="_blank"
      >
        this guide
      </NativeLink>
      .
    </Paragraph.Reading>

    <H2>Limited Metadata</H2>

    <Paragraph.Reading>
      You will be asked to enter the following information when completing the
      submission form:
    </Paragraph.Reading>

    <List.Ordered>
      <li>
        <strong>Corresponding Author: </strong>
        At this stage, we only need the name, institution, and email address of
        the corresponding author.
      </li>
      <li>
        <strong>Cover Letter: </strong>
        <Paragraph.Reading>
          To help with the initial evaluation of your submission, you will be
          asked to briefly answer the following questions in a cover letter:
        </Paragraph.Reading>
        <List.Unordered>
          <li>
            How will your work make others in the field think differently and
            move the field forward?
          </li>
          <li>
            How does your work relate to the current literature on the topic?
          </li>
          <li>
            Who do you consider to be the most relevant audience for this work?
          </li>
          <li>
            Have you made clear in the letter what the work has and has not
            achieved?
          </li>
        </List.Unordered>
        <Paragraph.Reading>
          In addition, please upload any related studies that you have published
          recently or have under consideration elsewhere as supporting files and
          describe them in your cover letter.
        </Paragraph.Reading>
      </li>
      <li>
        <strong>Manuscript Title</strong>
      </li>
      <li>
        <strong>Article Type: </strong> Information on the articles we publish
        can be found <Link to="/author-guide/types">here</Link>.
      </li>
      <li>
        <strong>Subject Area(s): </strong>
        <Paragraph.Reading>
          A list of major subject areas is provided from which authors should
          select one or two (choosing from:{' '}
          <NativeLink
            href="https://elifesciences.org/about/people/biochemistry-chemical-biology"
            target="_blank"
          >
            Biochemistry and Chemical Biology
          </NativeLink>
          ,{' '}
          <NativeLink
            href="https://elifesciences.org/about/people/cancer-biology"
            target="_blank"
          >
            Cancer Biology
          </NativeLink>
          ,{' '}
          <NativeLink
            href="http://elifesciences.org/about/people/cell-biology"
            target="_blank"
          >
            Cell Biology
          </NativeLink>
          ,{' '}
          <NativeLink
            href="https://elifesciences.org/about/people/chromosomes-gene-expression"
            target="_blank"
          >
            Chromosome and Gene Expression
          </NativeLink>
          ,{' '}
          <NativeLink
            href="https://elifesciences.org/about/people/computational-systems-biology"
            target="_blank"
          >
            Computational and Systems Biology
          </NativeLink>
          ,{' '}
          <NativeLink
            href="https://elifesciences.org/about/people/developmental-biology"
            target="_blank"
          >
            Developmental Biology
          </NativeLink>
          ,{' '}
          <NativeLink
            href="http://elifesciences.org/about/people/ecology"
            target="_blank"
          >
            Ecology
          </NativeLink>
          ,{' '}
          <NativeLink
            href="https://elifesciences.org/about/people/epidemiology-global-health"
            target="_blank"
          >
            Epidemiology and Global Health
          </NativeLink>
          ,{' '}
          <NativeLink
            href="https://elifesciences.org/about/people/evolutionary-biology"
            target="_blank"
          >
            Evolutionary Biology
          </NativeLink>
          ,{' '}
          <NativeLink
            href="https://elifesciences.org/about/people/genetics-and-genomics"
            target="_blank"
          >
            Genetics and Genomics
          </NativeLink>
          ,{' '}
          <NativeLink
            href="https://elifesciences.org/about/people/human-biology-medicine"
            target="_blank"
          >
            Human Biology and Medicine
          </NativeLink>
          ,{' '}
          <NativeLink
            href="https://elifesciences.org/about/people/immunology-inflammation"
            target="_blank"
          >
            Immunology and Inflammation
          </NativeLink>
          ,{' '}
          <NativeLink
            href="https://elifesciences.org/about/people/microbiology-infectious-disease"
            target="_blank"
          >
            Microbiology and Infectious Disease
          </NativeLink>
          ,{' '}
          <NativeLink
            href="https://elifesciences.org/about/people/neuroscience"
            target="_blank"
          >
            Neuroscience
          </NativeLink>
          ,{' '}
          <NativeLink
            href="https://elifesciences.org/about/people/physics-living-systems"
            target="_blank"
          >
            Physics of Living Systems
          </NativeLink>
          ,{' '}
          <NativeLink
            href="http://elifesciences.org/about/people/plant-biology"
            target="_blank"
          >
            Plant Biology
          </NativeLink>
          ,{' '}
          <NativeLink
            href="https://elifesciences.org/about/people/stem-cells-regenerative-medicine"
            target="_blank"
          >
            Stem Cells and Regenerative Medicine
          </NativeLink>
          ,{' '}
          <NativeLink
            href="https://elifesciences.org/about/people/structural-biology-molecular-biophysics"
            target="_blank"
          >
            Structural Biology and Molecular Physics
          </NativeLink>
          ).
        </Paragraph.Reading>
      </li>
      <li>
        <strong>Editor suggestions: </strong>
        Authors should be ready to suggest two of eLife&apos;s Senior Editors
        and at least two members of the Board of Reviewing Editors (select the
        appropriate subject area via the dropdown menu) who would be appropriate
        for the assessment of the work. In the event of potential competing
        interests amongst members of the editorial board, authors can exclude
        one Senior Editor and no more than two Reviewing Editors, in which case
        we will make every effort to follow author requests for excluded
        individuals. Please note that any requests to exclude Senior Editors or
        Reviewing Editors should be explained briefly in the accompanying cover
        letter.
      </li>
      <li>
        <strong>Reviewer suggestions: </strong>
        Authors can optionally suggest potential reviewers for their work at the
        Initial Submission stage. Requests to exclude individuals can also be
        made and must be accompanied with a brief explanation. We will make
        every effort to follow author requests for excluded individuals.
      </li>
    </List.Ordered>

    <Paragraph.Reading>
      If you receive an encouraging response to your Initial Submission, please
      review the guidelines relating to{' '}
      <Link to="/author-guide/full">Full Submissions</Link>.
    </Paragraph.Reading>
  </React.Fragment>
)

export default Initial
