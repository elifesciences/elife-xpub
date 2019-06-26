import React from 'react'
import { H1, H2, H3 } from '@pubsweet/ui'
import {
  Paragraph,
  NativeLink,
} from '@elifesciences/component-elife-ui/client/atoms'

import CalloutTextBox from '../../components/CalloutTextBox'
import List from '../../components/List'

const JournalPolicies = props => (
  <React.Fragment>
    <H1>Journal Policies</H1>

    <Paragraph.Reading>
      eLife is a member of the{' '}
      <NativeLink href="http://publicationethics.org/" target="_blank">
        Committee on Publication Ethics
      </NativeLink>{' '}
      (COPE), supports their principles, and follows their{' '}
      <NativeLink
        href="https://publicationethics.org/resources/flowcharts"
        target="_blank"
      >
        flowcharts
      </NativeLink>{' '}
      for dealing with potential breaches of publication ethics. eLife also
      follows, as far as possible, the recommendations outlined in the{' '}
      <NativeLink href="http://www.icmje.org/recommendations/" target="_blank">
        Uniform Requirements for Manuscripts Submitted to Biomedical Journals
      </NativeLink>
      , guidelines established by the ICMJE.
    </Paragraph.Reading>

    <Paragraph.Reading>
      Authors are expected to comply with best practice in research and
      publishing ethics, and with our associated guidelines and policies, for
      example with regard to authorship, competing interests, and data
      availability and reporting standards.
    </Paragraph.Reading>

    <Paragraph.Reading>
      eLife is a signatory of the{' '}
      <NativeLink href="https://centerforopenscience.org/top/" target="_blank">
        Transparency and Openness Promotion (TOP) Guidelines
      </NativeLink>
      , which is an initiative by the{' '}
      <NativeLink href="https://centerforopenscience.org" target="_blank">
        Center for Open Science
      </NativeLink>{' '}
      that promotes shared standards for increasing openness, transparency, and
      reproducibility.
    </Paragraph.Reading>

    <H2>Allegations of Misconduct</H2>

    <Paragraph.Reading>
      If we receive an allegation of potential research or publication
      misconduct, we will alert those affected and ask for their response. We
      reserve the right to suspend the review process where necessary; to
      publish an expression of concern for published papers where appropriate;
      and/or to ask the relevant employers, or institution, or an appropriate
      regulatory body to investigate. If someone has concerns about potential
      misconduct in a paper published by or under consideration by eLife, s/he
      should contact the journal office,{' '}
      <NativeLink href="mailto:editorial@elifesciences.org" target="_blank">
        editorial@elifesciences.org
      </NativeLink>
      , with their message addressed to the Editor-in-Chief, Randy Schekman.
    </Paragraph.Reading>

    <H2>Animal and/or Human Experiments</H2>

    <Paragraph.Reading>
      Work involving human subjects or animal experimentation is expected to be
      conducted to the highest ethical standards, for example in accordance with
      the{' '}
      <NativeLink
        href="https://www.wma.net/policies-post/wma-declaration-of-helsinki-ethical-principles-for-medical-research-involving-human-subjects/"
        target="_blank"
      >
        World Medical Association Declaration of Helsinki
      </NativeLink>{' '}
      for medical research, and with the relevant legislation and guidance for
      animal research listed by{' '}
      <NativeLink href="http://www.nc3rs.org.uk/" target="_blank">
        NC3Rs
      </NativeLink>
      .
    </Paragraph.Reading>

    <Paragraph.Reading>
      For clinical trials, eLife follows the{' '}
      <NativeLink
        href="http://www.icmje.org/about-icmje/faqs/clinical-trials-registration/"
        target="_blank"
      >
        recommendations of the ICMJE
      </NativeLink>{' '}
      that all trials must be prospectively registered to be considered for
      publication, and the clinical trial registration number will be requested
      during submission. When reporting randomised clinical trials, authors
      should follow the{' '}
      <NativeLink href="http://www.consort-statement.org/" target="_blank">
        CONSORT
      </NativeLink>{' '}
      guidelines and upload a CONSORT{' '}
      <NativeLink
        href="http://www.consort-statement.org/consort-statement/checklist"
        target="_blank"
      >
        checklist
      </NativeLink>{' '}
      and{' '}
      <NativeLink
        href="http://www.consort-statement.org/consort-statement/flow-diagram"
        target="_blank"
      >
        flow diagram
      </NativeLink>{' '}
      with their submission.
    </Paragraph.Reading>

    <Paragraph.Reading>
      For human subjects research informed consent must have been obtained (or
      the reason for lack of consent explained). When this work includes
      identifying, or potentially identifying, information, authors must also
      download the{' '}
      <NativeLink
        href="https://elife-cdn.s3.amazonaws.com/author-guide/elife_Consent_to_Publish_Form.pdf"
        target="_blank"
      >
        Consent Form for Publication in eLife
      </NativeLink>{' '}
      (PDF), which the individual, parent, or guardian must sign once they have
      read the article and been informed about the terms of the{' '}
      <NativeLink
        href="https://creativecommons.org/licenses/by/4.0/"
        target="_blank"
      >
        Creative Commons Attribution license
      </NativeLink>{' '}
      (form and guidance based on those developed by PLOS). The signed consent
      form should not be submitted alongside the article, but authors should
      file it with the individual&apos;s case notes and the ethics statement
      should state that consent authorisation for publication has been obtained.
    </Paragraph.Reading>

    <H2>Authorship</H2>

    <Paragraph.Reading>
      eLife follows the guidelines of the International Committee of Medical
      Journal Editors (ICMJE) for{' '}
      <NativeLink
        href="http://www.icmje.org/recommendations/browse/roles-and-responsibilities/defining-the-role-of-authors-and-contributors.html"
        target="_blank"
      >
        authorship and contributorship
      </NativeLink>{' '}
      and the{' '}
      <NativeLink
        href="https://docs.google.com/document/d/1aJxrQXYHW5U6By3KEAHrx1Iho6ioeh3ohNsRMwsoGPM/edit"
        target="_target"
      >
        Contributor Role Taxonomy
      </NativeLink>{' '}
      (CRediT) is used to indicate each author’s contributions.
    </Paragraph.Reading>

    <Paragraph.Reading>
      Please note that acquisition of funding or the provision of space,
      providing published data or materials, or general supervision of the
      research group alone does not justify authorship.
    </Paragraph.Reading>

    <Paragraph.Reading>
      Following the recommendations of the ICMJE regarding{' '}
      <NativeLink
        href="http://www.icmje.org/recommendations/browse/roles-and-responsibilities/defining-the-role-of-authors-and-contributors.html"
        target="_blank"
      >
        authorship and contributorship
      </NativeLink>
      , individuals who have contributed materially to the work, but do not
      satisfy the authorship criteria should be listed in the acknowledgements
      section. Authors should seek permission to mention any individuals listed
      in the acknowledgements.
    </Paragraph.Reading>

    <H2>Cell Lines</H2>

    <Paragraph.Reading>
      Regarding the use of cell lines, authors must report their source, confirm
      the identity has been authenticated, state the authentication method (such
      as STR profiling), and report the mycoplasma contamination testing status.
      Authors should authenticate the identity of their cell lines at least once
      per year, and when starting new work or new cell lines confirm that the
      cell lines are free from mycoplasma and other microorganisms. Authors
      should check the list of{' '}
      <NativeLink
        href="http://iclac.org/databases/cross-contaminations/"
        target="_blank"
      >
        commonly misidentified cell lines
      </NativeLink>{' '}
      maintained by the{' '}
      <NativeLink href="http://iclac.org/" target="_blank">
        International Cell Line Authentication Committee
      </NativeLink>{' '}
      before submission and justify the use of any cell lines contained therein.
      Cell line authentication services are offered by{' '}
      <NativeLink
        href="http://www.lgcstandards-atcc.org/Services/Testing%20Services.aspx"
        target="_blank"
      >
        ATCC
      </NativeLink>
      ,{' '}
      <NativeLink
        href="https://www.scienceexchange.com/services/cell-line-authentication"
        target="_blank"
      >
        Science Exchange
      </NativeLink>
      , and others.
    </Paragraph.Reading>

    <H2>Competing Interests</H2>

    <Paragraph.Reading>
      Authors, reviewers, and editors are all required to declare any competing interests that might be perceived to 
      interfere with the objectivity of the presentation or handling of the work. Any relevant patents, patent applications,
      and products in development that relate to a submission must be disclosed in full, including patent numbers and titles. 
      For further information on competing
      interests, see the{' '}
      <NativeLink
        href="http://www.icmje.org/recommendations/browse/roles-and-responsibilities/author-responsibilities--conflicts-of-interest.html"
        target="_blank"
      >
        recommendations of the ICMJE
      </NativeLink>{' '}
      and the guidance provided by{' '}
      <NativeLink
        href="http://journals.plos.org/plosmedicine/s/competing-interests"
        target="_blank"
      >
        PLOS
      </NativeLink>
      .
    </Paragraph.Reading>

    <H2 id="copyrightedMaterial">Copyrighted Material</H2>

    <Paragraph.Reading>
      Copyrighted material (in full or in part) should not be included in a
      submission to eLife, unless you have explicit permission from the
      copyright holder that it can be reproduced under the terms of a{' '}
      <NativeLink
        href="http://creativecommons.org/licenses/by/4.0/"
        target="_blank"
      >
        Creative Commons Attribution license
      </NativeLink>
      .
    </Paragraph.Reading>

    <Paragraph.Reading>
      Occasionally we have published figures or parts of figures which cannot be
      re-published under a{' '}
      <NativeLink
        href="http://creativecommons.org/licenses/by/4.0/"
        target="_blank"
      >
        Creative Commons Attribution license
      </NativeLink>
      . In those instances we ensure the correct attribution is provided within
      the human readable text (HTML and PDF versions of the article) and the
      underlying XML, for machine readability.
    </Paragraph.Reading>

    <H2>Availability of Data, Software, and Research Materials</H2>

    <Paragraph.Reading>
      Data, methods used in the analysis, and materials used to conduct the
      research must be clearly and precisely documented, and be maximally
      available to any researcher for purposes of reproducing the results or
      replicating the procedure.
    </Paragraph.Reading>

    <Paragraph.Reading>
      Regardless of whether authors use original data or are reusing data
      available from public repositories, they must provide program code,
      scripts for statistical packages, and other documentation sufficient to
      allow an informed researcher to precisely reproduce all published results.
    </Paragraph.Reading>

    <Paragraph.Reading>
      In rare cases, despite authors’ best efforts, certain data or materials
      cannot be shared for legal or ethical reasons. In such cases, authors must
      inform the editors at the time of submission. This will be taken into
      account during the review process. Authors are encouraged to anticipate
      data and material sharing at the beginning of their projects to provide
      for these circumstances. Editors may grant exceptions to data and material
      access requirements provided that authors:
    </Paragraph.Reading>

    <List.Unordered>
      <li>
        explain the restrictions on the dataset or materials and how they
        preclude public access;
      </li>
      <li>
        provide a public description of the steps others should follow to
        request access to the data or materials;
      </li>
      <li>
        provide software and other documentation that will precisely reproduce
        all published results;
      </li>
      <li>
        provide access to all data and materials for which the constraints do
        not apply.
      </li>
    </List.Unordered>

    <H3>Data Availability</H3>

    <Paragraph.Reading>
      To maintain high standards of research reproducibility, and to promote the
      reuse of new findings, eLife requires all datasets associated with an
      article to be made freely and widely available (unless there are strong
      reasons to restrict access, for example in the case of human subjects
      data), in the most useful formats, and according to the relevant reporting
      standards.
    </Paragraph.Reading>

    <Paragraph.Reading>
      Wherever possible, authors should make major datasets available using
      domain-specific public archives (for example,{' '}
      <NativeLink href="http://www.ncbi.nlm.nih.gov/genbank/" target="_blank">
        GenBank
      </NativeLink>
      ,{' '}
      <NativeLink href="http://www.rcsb.org/pdb/home/home.do" target="_blank">
        Protein Data Bank
      </NativeLink>
      , and{' '}
      <NativeLink href="http://clinicaltrials.gov/" target="_blank">
        ClinicalTrials.gov
      </NativeLink>
      ), or generic databases (for example,{' '}
      <NativeLink href="http://datadryad.org/" target="_blank">
        Dryad
      </NativeLink>
      ,{' '}
      <NativeLink href="http://dataverse.org/" target="_blank">
        Dataverse
      </NativeLink>{' '}
      or{' '}
      <NativeLink href="http://osf.io/" target="_blank">
        the Open Science Framework
      </NativeLink>
      ) where a domain specific archive does not exist. A comprehensive
      catalogue of databases has been compiled by the{' '}
      <NativeLink href="https://fairsharing.org/" target="_blank">
        FAIRsharing information resource
      </NativeLink>
      .
    </Paragraph.Reading>

    <Paragraph.Reading>Authors using original data must:</Paragraph.Reading>

    <List.Unordered>
      <li>
        make the data available at a trusted digital repository (however, if all
        data required to reproduce the reported analyses appears in the article
        text, tables, and figures then it does not also need to be posted to a
        repository);
      </li>
      <li>
        include all variables, treatment conditions, and observations described
        in the manuscript;
      </li>
      <li>
        provide a full account of the procedures used to collect, pre-process,
        clean, or generate the data;
      </li>
      <li>
        provide research materials and description of procedures necessary to
        conduct an independent replication of the research.
      </li>
    </List.Unordered>

    <Paragraph.Reading>
      Trusted repositories adhere to policies that make data discoverable,
      accessible, usable, and preserved for the long term. Trusted repositories
      also assign unique and persistent identifiers. Author-maintained websites
      are not compliant with this requirement.
    </Paragraph.Reading>

    <Paragraph.Reading>
      Authors using unpublished datasets must abide by the relevant community
      guidelines for the use and acknowledgment of those data resources
      (including the{' '}
      <NativeLink
        href="http://www.genome.gov/pages/research/wellcomereport0303.pdf"
        target="_blank"
      >
        Fort Lauderdale
      </NativeLink>{' '}
      and{' '}
      <NativeLink
        href="http://www.nature.com/nature/journal/v461/n7261/full/461168a.html"
        target="_blank"
      >
        Toronto
      </NativeLink>{' '}
      agreements in the case of genomic datasets), obtaining permission where
      required (which should be stated in the cover letter), and citing the
      appropriate laboratory, website, and accession numbers.
    </Paragraph.Reading>

    <H3>Software</H3>

    <Paragraph.Reading>
      Authors are required to follow the guidelines developed by{' '}
      <NativeLink
        href="http://journals.plos.org/ploscompbiol/s/materials-and-software-sharing"
        target="_blank"
      >
        PLOS
      </NativeLink>{' '}
      if new software or a new algorithm is central to the submission; for
      example, authors must confirm that software conforms to the{' '}
      <NativeLink href="http://opensource.org/docs/osd" target="_blank">
        Open Source Definition
      </NativeLink>{' '}
      and is deposited in an appropriate public repository. To ensure that
      software can be reproduced without restrictions and that authors are
      properly acknowledged for their work, authors should license their code
      using an{' '}
      <NativeLink href="https://opensource.org/licenses" target="_blank">
        open source license
      </NativeLink>
      .
    </Paragraph.Reading>

    <Paragraph.Reading>
      Authors are encouraged to use version control services such as GitHub,
      GitLab, and SourceForge. eLife maintains a{' '}
      <NativeLink
        href="http://github.com/elifesciences-publications/"
        target="_blank"
      >
        GitHub account
      </NativeLink>{' '}
      to archive code accompanying eLife publications that has been deposited on
      GitHub or another version control service. Binary files (&quot;non-text
      files&quot;, such as images, zip files, or program data) should be kept to
      a minimum and, if possible, they should not exceed 50MB. Please try to
      avoid files larger than 100MB as they will require special handling.
    </Paragraph.Reading>

    <H3>Research Materials and RRIDs</H3>

    <Paragraph.Reading>
      In accordance with the principles established in{' '}
      <NativeLink
        href="http://www.plantphysiol.org/content/132/1/19"
        target="_blank"
      >
        ‘Sharing Publication-Related Data and Materials’
      </NativeLink>{' '}
      (doi:10.1104/pp.900068), a condition of publication is that authors must
      make the materials and resources described in their article promptly
      available upon reasonable request from academic researchers.
    </Paragraph.Reading>

    <Paragraph.Reading>
      All biological reagents must be made available to qualified investigators
      upon reasonable request. We strongly encourage authors to deposit copies
      of their plasmids as DNA or bacterial stocks with repositories such as{' '}
      <NativeLink href="http://www.addgene.org/" target="_blank">
        Addgene
      </NativeLink>{' '}
      or{' '}
      <NativeLink
        href="http://plasmid.med.harvard.edu/PLASMID/"
        target="_blank"
      >
        PlasmID
      </NativeLink>
      . Other established repositories for biological materials include the{' '}
      <NativeLink href="http://www.atcc.org/" target="_blank">
        American Type Culture Collection
      </NativeLink>
      ,{' '}
      <NativeLink href="https://abrc.osu.edu/" target="_blank">
        Arabidopsis Biological Resource Center
      </NativeLink>
      ,{' '}
      <NativeLink href="http://flystocks.bio.indiana.edu/" target="_blank">
        Bloomington Drosophila Stock Center
      </NativeLink>
      ,{' '}
      <NativeLink href="https://cgc.umn.edu/" target="_blank">
        Caenorhabditis Genetics Center
      </NativeLink>
      , the{' '}
      <NativeLink href="http://www.eucomm.org/" target="_blank">
        European Conditional Mouse Mutagenesis Program
      </NativeLink>
      , the{' '}
      <NativeLink href="https://www.infrafrontier.eu/" target="_blank">
        European Mouse Mutant Archive
      </NativeLink>
      , the{' '}
      <NativeLink href="http://www.komp.org/" target="_blank">
        Knockout Mouse Project
      </NativeLink>
      , the{' '}
      <NativeLink href="http://www.jax.org/" target="_blank">
        Jackson Laboratory
      </NativeLink>
      , the{' '}
      <NativeLink href="http://www.mmrrc.org/" target="_blank">
        Mutant Mouse Regional Resource Centers
      </NativeLink>
      , and{' '}
      <NativeLink href="http://www.brc.riken.go.jp/inf/en/DB/" target="_blank">
        RIKEN Bioresource Centre
      </NativeLink>
      .
    </Paragraph.Reading>

    <Paragraph.Reading>
      Authors should include a statement at the end of the Materials and methods
      to provide information about the availability of the materials and
      resources described in the article, including any restrictions in
      availability or use.
    </Paragraph.Reading>

    <Paragraph.Reading>
      To help promote the identification, discovery, and reuse of key research
      resources, we encourage you to include Research Resource Identifiers
      (RRIDs) within the Materials and Methods section to identify the model
      organisms, cells lines, antibodies, and tools (such as software or
      databases) you have used (e.g.{' '}
      <NativeLink
        href="https://scicrunch.org/resolver/RRID:AB_2178887"
        target="_blank"
      >
        RRID:AB_2178887
      </NativeLink>{' '}
      for an antibody,{' '}
      <NativeLink
        href="https://scicrunch.org/resolver/RRID:MGI:3840442"
        target="_blank"
      >
        RRID:MGI:3840442
      </NativeLink>{' '}
      for an organism,{' '}
      <NativeLink
        href="https://scicrunch.org/resolver/RRID:CVCL_1H60"
        target="_blank"
      >
        RRID:CVCL_1H60
      </NativeLink>{' '}
      for a cell line, and{' '}
      <NativeLink
        href="https://scicrunch.org/resolver/RRID:SCR_007358"
        target="_blank"
      >
        RRID:SCR_007358
      </NativeLink>{' '}
      for a tool). The{' '}
      <NativeLink href="https://scicrunch.org/resources" target="_blank">
        RRID Portal
      </NativeLink>{' '}
      lists existing RRIDs, and instructions for creating a new one if an RRID
      matching the resource does not already exist.
    </Paragraph.Reading>

    <H2>Dual Use</H2>

    <Paragraph.Reading>
      Regarding the oversight of dual use life-sciences research, we follow the
      recommendations formulated by the{' '}
      <NativeLink
        href="https://osp.od.nih.gov/biotechnology/dual-use-research-of-concern/"
        target="_blank"
      >
        National Science Advisory Board for Biosecurity
      </NativeLink>{' '}
      (NSABB). If there are any concerns about dual use life-sciences research
      during submission or review, please bring them to the attention of the
      journal’s editors.
    </Paragraph.Reading>

    <H2>Editorial Independence and Integrity</H2>

    <Paragraph.Reading>
      eLife follows the guidance of the{' '}
      <NativeLink
        href="http://www.wame.org/policy-statements#Relationship between Editors and Owners"
        target="_blank"
      >
        World Association of Medical Editors
      </NativeLink>{' '}
      and the{' '}
      <NativeLink href="https://www.councilscienceeditors.org/" target="_blank">
        Council of Science Editors
      </NativeLink>{' '}
      regarding editorial independence. The editors of <em>eLife,</em> under the
      leadership of the{' '}
      <NativeLink
        href="http://elifesciences.org/about#leadership"
        target="_blank"
      >
        Editor-in-Chief
      </NativeLink>
      , have sole responsibility, authority, and accountability for the
      editorial content of the journal. Submissions are judged on their own
      merits, regardless of funding, author affiliations, or author
      relationships with eLife.
    </Paragraph.Reading>

    <Paragraph.Reading>
      The funders and sponsors of eLife have no role in the selection,
      evaluation, or editing of the content. The content published in eLife does
      not represent the opinions of the Howard Hughes Medical Institute, the Max
      Planck Society, the Wellcome Trust or the Knut and Alice Wallenberg
      Foundation.
    </Paragraph.Reading>

    <Paragraph.Reading>
      Information provided during the submission and review process is strictly
      confidential.
    </Paragraph.Reading>

    <H2>Image Acquisition and Presentation</H2>

    <Paragraph.Reading>
      Image files must not be manipulated or adjusted in any way that could lead
      to misinterpretation of the information present in the original image. See{' '}
      <NativeLink
        href="http://jcb.rupress.org/content/166/1/11.full"
        target="_blank"
      >
        &apos;What&apos;s in a picture? The temptation of image
        manipulation&apos;
      </NativeLink>{' '}
      (Rossner and Yamada 2004, Journal of Cell Biology, 166:11) and also{' '}
      <NativeLink
        href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4114110/"
        target="_blank"
      >
        &apos;Avoiding Twisted Pixels: Ethical Guidelines for the Appropriate
        Use and Manipulation of Scientific Digital Images&apos;
      </NativeLink>{' '}
      (Cromey 2010, Sci Eng Ethics, 16-639-667) for valuable guidance on
      acceptable practice and examples of inappropriate manipulation. Please
      take note of the following guidance in particular:
    </Paragraph.Reading>

    <List.Unordered>
      <li>
        Minimal processing of images (for example, changing brightness and
        contrast) is appropriate only where it is applied equally across the
        whole image and is equally applied to controls.
      </li>
      <li>Contrast should not be adjusted to obscure data.</li>
      <li>
        Processing an image to emphasise one region at the expense of others, or
        to emphasise experimental data relative to the control, is not
        permitted.
      </li>
      <li>
        Combining images that should otherwise be presented separately may
        misrepresent the original data. If different images do need to be
        combined, then this should be clearly indicated in the image (for
        example, including dividing lines in gels) and described in the Figure
        legend.
      </li>
    </List.Unordered>

    <Paragraph.Reading>
      Please note that authors should provide information within their
      submission about the tools and techniques used when acquiring and
      preparing images. For example, submissions including microscopy images or
      autoradiograms should include information about the exposure times, the
      acquisition parameters, and whether the image received any
      post-acquisition treatment (for example stating if the format or scales
      were modified).
    </Paragraph.Reading>

    <Paragraph.Reading>
      Images may be subject to screening prior to acceptance and we may need to
      request the original, unprocessed figure files/raw data for further
      review.
    </Paragraph.Reading>

    <H2>Licensing</H2>

    <Paragraph.Reading>
      Because articles published by eLife are licensed under a{' '}
      <NativeLink
        href="https://creativecommons.org/licenses/by/4.0/"
        target="_blank"
      >
        Creative Commons Attribution license
      </NativeLink>
      , others are free to copy, distribute, and reuse them (in part or in
      full), without needing to seek permission, as long as the author and
      original source are properly cited.
    </Paragraph.Reading>

    <H2>Media Policy</H2>

    <Paragraph.Reading>
      eLife’s media policy is designed to encourage high-quality, informed and
      widespread discussion of new research – before and after publication.
    </Paragraph.Reading>

    <H3>Presenting and discussing work prior to publication</H3>

    <Paragraph.Reading>
      Prior to publication, authors are encouraged to present their findings to
      their peers, including at meetings and conferences; to deposit a copy of
      their manuscript with a preprint server (or other open repository or
      website); and to blog about their findings. None of these activities will
      affect consideration of a manuscript for publication in eLife. Where there
      is media interest in a paper that has been accepted by eLife, and likely
      media coverage in advance of publication, we encourage the authors to take
      advantage of the eLife option to publish their manuscript within a few
      days of acceptance (our “publish on accept” service), so that readers of
      any (potential) early coverage will be able to access the full paper as
      soon as possible.
    </Paragraph.Reading>

    <Paragraph.Reading>
      Authors are welcome to speak to the media about their work at any time
      prior to publication and may share advance copies of their manuscript with
      journalists as they prefer. They may also wish to ask their institutional
      press officers to help with advance promotion, once the manuscript is
      accepted. However, eLife encourages press officers to pitch studies widely
      at the time of publication only, rather than in advance, so that as many
      journalists as possible receive the story, and access to the full,
      peer-reviewed paper, at the same time.
    </Paragraph.Reading>

    <H3>Our policy not to embargo eLife papers</H3>

    <Paragraph.Reading>
      Because authors are completely free to release their content ahead of
      publication and to talk with the media at any stage, we do not release
      content under embargo, except under exceptional circumstances. This means
      that journalists can write and publish articles about a study in advance
      of publication without breaking an embargo. However, we strongly recommend
      that their stories are published at the time of or after publication, so
      that readers have access to the full, peer-reviewed paper.
    </Paragraph.Reading>

    <H3>Making content widely accessible</H3>

    <Paragraph.Reading>
      Many eLife papers are published with a plain-language summary (called an
      eLife digest) to explain the background and central findings of the work
      to a broad readership. We also publish the most substantive parts of the
      decision letter that is sent to authors after peer review (and which is
      based on the referees&apos; reports on the paper), along with the
      authors&apos; response to this letter, to provide greater context for the
      work. Where eLife considers papers to be of potential interest to a broad
      audience, these will also be promoted widely to the media and to
      interested readers either on the day of publication or post publication.
    </Paragraph.Reading>

    <Paragraph.Reading>
      More information for institutional press officers and journalists is
      available at{' '}
      <NativeLink
        href="https://elifesciences.org/for-the-press"
        target="_blank"
      >
        https://elifesciences.org/for-the-press
      </NativeLink>
      .
    </Paragraph.Reading>

    <H2>Nomenclature</H2>

    <Paragraph.Reading>
      Correct and established nomenclature should be used throughout the
      article, such as for gene names, species names and SI units. The
      appropriate nomenclature databases for correct gene names and symbols
      should be consulted. Helpful reference points for approved nomenclature
      include{' '}
      <NativeLink href="http://flybase.org/" target="_blank">
        Genetic nomenclature for <em>Drosophila melanogaster</em>
      </NativeLink>
      ;{' '}
      <NativeLink
        href="http://www.wormbase.org/about/userguide/nomenclature"
        target="_blank"
      >
        Genetic Nomenclature for <em>Caenorhabditis elegans</em>
      </NativeLink>
      ;{' '}
      <NativeLink
        href="http://www.maizegdb.org/maize_nomenclature.php"
        target="_blank"
      >
        A Standard For Maize Genetics Nomenclature
      </NativeLink>
      ;{' '}
      <NativeLink
        href="http://www.arabidopsis.org/portals/nomenclature/guidelines.jsp"
        target="_blank"
      >
        Arabidopsis Nomenclature
      </NativeLink>
      ;{' '}
      <NativeLink
        href="http://www.genenames.org/about/guidelines"
        target="_blank"
      >
        Guidelines for Human Gene Nomenclature
      </NativeLink>
      ;{' '}
      <NativeLink
        href="http://www.informatics.jax.org/mgihome/nomen/gene.shtml"
        target="_blank"
      >
        Rules for Nomenclature of Genes, Genetic Markers, Alleles, and Mutations
        in Mouse and Rat
      </NativeLink>
      ; the{' '}
      <NativeLink
        href="http://www.xenbase.org/gene/static/geneNomenclature.jsp"
        target="_blank"
      >
        Xenopus Gene Nomenclature Guidelines
      </NativeLink>
      ; and the{' '}
      <NativeLink
        href="https://wiki.zfin.org/display/general/ZFIN+Zebrafish+Nomenclature+Guidelines"
        target="_blank"
      >
        Zebrafish Nomenclature Guidelines
      </NativeLink>
      .
    </Paragraph.Reading>

    <Paragraph.Reading>
      Note that in the specific case of a study that reports a new taxon name,
      authors are required to follow the guidelines developed by PLOS for{' '}
      <NativeLink
        href="http://journals.plos.org/plosone/s/submission-guidelines"
        target="_blank"
      >
        zoological and botanical names
      </NativeLink>
      .
    </Paragraph.Reading>

    <H2>Preregistration</H2>

    <Paragraph.Reading>
      Preregistration of studies involves registering the study design,
      variables, and treatment conditions prior to conducting the research. For
      clinical trials, eLife follows the{' '}
      <NativeLink
        href="http://www.icmje.org/about-icmje/faqs/clinical-trials-registration/"
        target="_blank"
      >
        recommendations of the ICMJE
      </NativeLink>{' '}
      that all trials must be prospectively registered to be considered for
      publication, and the clinical trial registration number will be requested
      during submission.
    </Paragraph.Reading>

    <Paragraph.Reading>
      eLife is using the Registered Reports approach as part of the{' '}
      <NativeLink
        href="https://elifesciences.org/collections/reproducibility-project-cancer-biology"
        target="_blank"
      >
        Reproducibility Project: Cancer Biology
      </NativeLink>
      . For other submissions, authors are encouraged to consider whether
      preregistration would be appropriate, noting if they have done so within
      their cover letter.
    </Paragraph.Reading>

    <H2>Reporting Standards</H2>

    <Paragraph.Reading>
      To facilitate the interpretation and replication of experiments, authors
      are required to complete eLife&apos;s{' '}
      <NativeLink
        href="https://cdn.elifesciences.org/xpub/guides/transparent_reporting.pdf"
        target="_blank"
      >
        Transparent Reporting Form
      </NativeLink>{' '}
      before peer review. Authors are also required to adhere to
      well-established reporting standards, such as for microarray experiments,
      clinical trials, and so on.
    </Paragraph.Reading>

    <Paragraph.Reading>
      Authors are required to cite the specific guidelines that they have
      followed in the reporting of their work, and we encourage authors to
      upload any relevant reporting checklists or documents as a Reporting
      Standards Document to indicate the use of appropriate reporting guidelines
      for health-related research (see{' '}
      <NativeLink href="http://www.equator-network.org/" target="_blank">
        EQUATOR Network
      </NativeLink>
      ), life science research (see the{' '}
      <NativeLink href="https://biosharing.org/" target="_blank">
        BioSharing Information Resource
      </NativeLink>
      ), or the{' '}
      <NativeLink
        href="http://www.plosbiology.org/article/info:doi/10.1371/journal.pbio.1000412"
        target="_blank"
      >
        ARRIVE guidelines
      </NativeLink>{' '}
      for reporting work involving animal research.
    </Paragraph.Reading>

    <Paragraph.Reading>
      In the specific case of a study containing an X-ray crystal structure,
      authors are required to upload a validation summary report from one of the{' '}
      <NativeLink href="http://www.wwpdb.org/" target="_blank">
        Worldwide Protein Data Bank
      </NativeLink>{' '}
      organisations as a Related Manuscript File. The associated maps and
      coordinate data for the structure should be placed into a zipped folder
      and uploaded as a Supporting Zip Document; please label this as &quot;maps
      and coordinate data for review&quot;.
    </Paragraph.Reading>

    <Paragraph.Reading>
      In the specific case of a study containing functional enzyme data, we
      encourage authors to deposit data to{' '}
      <NativeLink
        href="https://www.beilstein-strenda-db.org/strenda/"
        target="_blank"
      >
        STRENDA DB
      </NativeLink>{' '}
      and to upload the “Experimental data fact sheet” that accompanies the
      deposition as a Reporting Standards Document in the submission to eLife.
    </Paragraph.Reading>

    <CalloutTextBox>
      <Paragraph.Reading>
        <strong>Research Conducted by eLife.</strong> As a way of improving our
        services, we periodically undertake research and surveys relating to
        eLife&apos;s submission and review process. Where appropriate we will
        share our findings so that others can benefit. Participation does not
        affect the decision on manuscripts under consideration, or our policies
        relating to the confidentiality of the review process. If you would like
        to opt out of eLife&apos;s research and/or surveys, please{' '}
        <NativeLink href="mailto:editorial@elifesciences.org" target="_blank">
          contact the journal office
        </NativeLink>
        .
      </Paragraph.Reading>
    </CalloutTextBox>
  </React.Fragment>
)

export default JournalPolicies
