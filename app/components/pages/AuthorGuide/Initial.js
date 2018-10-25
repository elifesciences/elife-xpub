import React from 'react'
import { H1, H2, Link } from '@pubsweet/ui'

import Paragraph from '../../ui/atoms/Paragraph'
import ExternalLink from '../../ui/atoms/ExternalLink'
import List from '../../ui/atoms/List'
import RequiredInfoTable from './RequiredInfoTable'

const Initial = props => (
  <React.Fragment>
    <H1>Initial submissions</H1>

    <H2>Cover Letter</H2>

    <Paragraph>
      To help with the initial evaluation of your submission, please briefly
      answer the following questions in your cover letter:
    </Paragraph>

    <List.Unordered>
      <li>
        How will your work make others in the field think differently and move
        the field forward?
      </li>
      <li>How does your work relate to the current literature on the topic?</li>
      <li>
        Who do you consider to be the most relevant audience for this work?
      </li>
      <li>
        Have you made clear in the letter what the work has and has not
        achieved?
      </li>
    </List.Unordered>

    <Paragraph>
      In addition, please upload any related studies that you have published
      recently or have under consideration elsewhere as related manuscript files
      and describe them in your cover letter.
    </Paragraph>

    <H2>Single Manuscript PDF</H2>

    <List.Unordered>
      <li>
        Authors should start by submitting their manuscript text and figures as
        a single PDF (smaller than 15MB, using the article file type), organised
        with easy readability in mind (please upload one article file only).
        Please include page and line numbers, and a legible font size for the
        main text and figure legends. We encourage authors to embed figures and
        tables at appropriate places within the main text for the initial
        submission.
      </li>
      <li>
        To facilitate the evaluation of the submission, we highly recommend
        including all authors for each reference in the reference list (e.g.
        John Smith, Anthony Murray and Peter Castle rather than John Smith et
        al.), although discretion can be used to truncate very long lists of
        authors.
      </li>
    </List.Unordered>

    <Paragraph>
      The manuscript should include the following components:
    </Paragraph>

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
        <strong>Abstract: </strong> The abstract should be fewer than 150 words
        and should not contain subheadings. It should provide a clear, measured,
        and concise summary of the work. If the biological system (species names
        or broader taxonomic groups if appropriate) is not mentioned in the
        title, it must be included in the abstract.
      </li>
      <li>
        <strong>
          Introduction, Results, Discussion, Materials and Methods:{' '}
        </strong>
        <Paragraph>
          We encourage a clear and concise style of writing. Various writing
          guides are available, including Preparing a Manuscript for Submission
          to a Biomedical Journal (ICMJE) and The Elements of Style (New York:
          bartleby.com, 1999).
        </Paragraph>
        <Paragraph>
          Any &quot;personal communications&quot; relating to unpublished data
          should be incorporated within the main text, in the following format:
          (Author Initial(s) and Surname, personal communication, Month and
          Year). Authors should have permission from anyone named in this way
          and should be aware that a supporting letter will sometimes be
          requested.
        </Paragraph>
        <Paragraph>
          Within the Materials and Methods and/or figure legends, we encourage
          authors to provide complete information about their experiments,
          analyses, or data collection to ensure that readers can easily
          understand what was measured and analysed, and can accurately perform
          the relevant protocols.
        </Paragraph>
        <Paragraph>
          In cases where a new method within the submission would benefit from
          step-by-step protocols in addition to the methods described in the
          article, we would encourage authors to also consider submitting a
          detailed protocol to{' '}
          <ExternalLink
            href="https://bio-protocol.org/login.aspx?in=2"
            target="_blank"
          >
            Bio-protocol
          </ExternalLink>
          .
        </Paragraph>
        <Paragraph>
          On first mention, please provide details of any manufacturers in the
          following format: company name, city, country (or state, if based in
          the United States).
        </Paragraph>
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
        <Paragraph>
          Accepted and published works, datasets (newly generated and previously
          published), program code, and previously published methods should be
          appropriately cited and included in the reference list to ensure that
          a wide range of research objects are afforded recognition through
          citation.
        </Paragraph>
        <Paragraph>
          Please find below the information we require for each type of
          reference. Please note, authors do not need to spend time formatting
          their references and can submit manuscripts formatted in a variety of
          reference styles, including Harvard, Vancouver, and Chicago. Wherever
          possible, please do not truncate the number of authors in the
          references list, but please do provide a DOI if possible.
        </Paragraph>
      </li>
    </List.Ordered>

    <RequiredInfoTable />

    <Paragraph>
      If using a reference manager, we suggest selecting APA style as this is
      the best match for eLife reference style. However, we accept any reference
      style and will format all references during the production process.
    </Paragraph>

    <H2>Figures, Tables, and Rich Media Files</H2>

    <Paragraph>
      Figures and tables should be included within the PDF. If authors already
      have a file available with the figures and tables embedded within the
      text, please provide this, but otherwise the figures and tables can be
      included at the end. Each figure and table should fit on one page,
      together with a title and concise legend (where appropriate), ideally on
      the same page as the display item. If this is not possible, titles and
      legends should be included at the end of the article file. Figures and
      tables should be numbered in the order in which they are cited in the
      text.
    </Paragraph>

    <Paragraph>
      We encourage the use of rich media files: for example, videos, audio
      clips, animations, slideshows, and interactive diagrams. Authors can
      upload such files during the Initial Submission process if they will
      assist in the initial assessment but otherwise they can be uploaded if a
      Full Submission is requested. Anything crucial for the initial evaluation
      should be uploaded at the Initial Submission stage (either as rich media
      or supplementary files).
    </Paragraph>

    <Paragraph>
      At this stage, supplementary figures and tables can be included if they
      exist, and if desired, within the single PDF.
    </Paragraph>

    <Paragraph>
      When preparing figures, we recommend that authors follow the principles of{' '}
      <ExternalLink href="http://jfly.iam.u-tokyo.ac.jp/color/" target="_blank">
        Colour Universal Design
      </ExternalLink>{' '}
      (Masataka Okabe and Kei Ito, J*FLY), whereby colour schemes are chosen to
      ensure maximum accessibility for all types of colour vision.
    </Paragraph>

    <Paragraph>
      When preparing coloured tables, authors should note that we can only
      accomodate schemes as outlined in{' '}
      <ExternalLink
        href="https://cdn.elifesciences.org/author-guide/tables-colour.pdf?_ga=2.122882312.2069272108.1540132848-2034406101.1537543708"
        target="_blank"
      >
        this guide
      </ExternalLink>
      .
    </Paragraph>

    <H2>Limited Metadata</H2>

    <Paragraph>
      You will be asked to enter the following information in the submission
      system:
    </Paragraph>

    <List.Ordered>
      <li>
        <strong>Title</strong>
      </li>
      <li>
        <strong>Abstract</strong>
      </li>
      <li>
        <strong>Corresponding Author: </strong>
        On the submission form, we only need the name, address (department,
        institution, city, and country), telephone number, and email address of
        the corresponding author.
      </li>
      <li>
        <strong>Major Subject Area(s): </strong>
        <Paragraph>
          A list of major subject areas is provided from which authors should
          select one or two (choosing from:{' '}
          <ExternalLink
            href="https://elifesciences.org/about/people/biochemistry-chemical-biology"
            target="_blank"
          >
            Biochemistry
          </ExternalLink>
          ,{' '}
          <ExternalLink
            href="https://elifesciences.org/about/people/structural-biology-molecular-biophysics"
            target="_blank"
          >
            Biophysics & Structural biology
          </ExternalLink>
          ,{' '}
          <ExternalLink
            href="https://elifesciences.org/about/people/cancer-biology"
            target="_blank"
          >
            Cancer Biology
          </ExternalLink>
          ,{' '}
          <ExternalLink
            href="http://elifesciences.org/about/people/cell-biology"
            target="_blank"
          >
            Cell Biology
          </ExternalLink>
          ,{' '}
          <ExternalLink
            href="https://elifesciences.org/about/people/developmental-biology-stem-cells"
            target="_blank"
          >
            Developmental Biology & Stem Cells
          </ExternalLink>
          ,{' '}
          <ExternalLink
            href="https://elifesciences.org/about/people/computational-systems-biology"
            target="_blank"
          >
            Computational & Systems Biology
          </ExternalLink>
          ,{' '}
          <ExternalLink
            href="http://elifesciences.org/about/people/ecology"
            target="_blank"
          >
            Ecology
          </ExternalLink>
          ,{' '}
          <ExternalLink
            href="https://elifesciences.org/about/people/epidemiology-global-health"
            target="_blank"
          >
            Epidemiology & Global Health
          </ExternalLink>
          ,{' '}
          <ExternalLink
            href="https://elifesciences.org/about/people/genes-chromosomes"
            target="_blank"
          >
            Genes & Chromosomes
          </ExternalLink>
          ,{' '}
          <ExternalLink
            href="https://elifesciences.org/about/people/genomics-evolutionary-biology"
            target="_blank"
          >
            Genomics & Evolutionary Biology
          </ExternalLink>
          ,{' '}
          <ExternalLink
            href="https://elifesciences.org/about/people/human-biology-medicine"
            target="_blank"
          >
            Human Biology & Medicine
          </ExternalLink>
          ,{' '}
          <ExternalLink
            href="https://elifesciences.org/about/people/immunology"
            target="_blank"
          >
            Immunology
          </ExternalLink>
          ,{' '}
          <ExternalLink
            href="https://elifesciences.org/about/people/microbiology-infectious-disease"
            target="_blank"
          >
            Microbiology & Infectious Disease
          </ExternalLink>
          ,{' '}
          <ExternalLink
            href="https://elifesciences.org/about/people/neuroscience"
            target="_blank"
          >
            Neuroscience
          </ExternalLink>
          ,{' '}
          <ExternalLink
            href="http://elifesciences.org/about/people/plant-biology"
            target="_blank"
          >
            Plant Biology
          </ExternalLink>
          ).
        </Paragraph>
      </li>
      <li>
        <strong>Funding information: </strong>
        All financial support should be included. At this stage only the funder
        names are required.
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
    </List.Ordered>

    <Paragraph>
      If you receive an encouraging response to your Initial Submission, please
      review the guidelines relating to{' '}
      <Link to="/author-guide/full">Full Submissions</Link>.
    </Paragraph>
  </React.Fragment>
)

export default Initial
