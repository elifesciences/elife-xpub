import React from 'react'

import RefTable from 'ui/molecules/RefTable'

const RequiredInfoTable = props => (
  <React.Fragment>
    <RefTable {...props}>
      <RefTable.Tr>
        <RefTable.Th />
        <RefTable.Th>Journal</RefTable.Th>
        <RefTable.Th>Book</RefTable.Th>
        <RefTable.Th>Website</RefTable.Th>
        <RefTable.Th>Data citation</RefTable.Th>
        <RefTable.Th>Software ‡</RefTable.Th>
        <RefTable.Th>Pre-print</RefTable.Th>
        <RefTable.Th>Conference proceedings</RefTable.Th>
        <RefTable.Th>Periodical</RefTable.Th>
        <RefTable.Th>Technical report</RefTable.Th>
        <RefTable.Th>Thesis</RefTable.Th>
        <RefTable.Th>Patent</RefTable.Th>
      </RefTable.Tr>
      <RefTable.Tr>
        <RefTable.Th>Authors</RefTable.Th>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td>✓°</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
      </RefTable.Tr>
      <RefTable.Tr>
        <RefTable.Th>Editors</RefTable.Th>
        <RefTable.Td />
        <RefTable.Td>✓†</RefTable.Td>
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td />
      </RefTable.Tr>
      <RefTable.Tr>
        <RefTable.Th>Year</RefTable.Th>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td />
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td>✓§</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
      </RefTable.Tr>
      <RefTable.Tr>
        <RefTable.Th>Date accessed and publication date</RefTable.Th>
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td />
      </RefTable.Tr>
      <RefTable.Tr>
        <RefTable.Th>
          Title (of article, chapter, abstract, software etc.)
        </RefTable.Th>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td>✓</RefTable.Td>
      </RefTable.Tr>
      <RefTable.Tr>
        <RefTable.Th>
          Publication title (e.g. journal, book, database, website, conference
          proceedings, software host etc.)
        </RefTable.Th>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td />
      </RefTable.Tr>
      <RefTable.Tr>
        <RefTable.Th>Volume</RefTable.Th>
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td />
      </RefTable.Tr>
      <RefTable.Tr>
        <RefTable.Th>Page range OR eLocation ID</RefTable.Th>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td>✓†</RefTable.Td>
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td />
      </RefTable.Tr>
      <RefTable.Tr>
        <RefTable.Th>
          Identifier (such as DOI , ISBN, accession or patent number)
        </RefTable.Th>
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td />
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td />
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td />
      </RefTable.Tr>
      <RefTable.Tr>
        <RefTable.Th>
          Location (of publisher, conference, patent etc.)
        </RefTable.Th>
        <RefTable.Td />
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td />
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td />
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
      </RefTable.Tr>
      <RefTable.Tr>
        <RefTable.Th>Publisher</RefTable.Th>
        <RefTable.Td />
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td />
      </RefTable.Tr>
      <RefTable.Tr>
        <RefTable.Th>Edition</RefTable.Th>
        <RefTable.Td />
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td />
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td />
        <RefTable.Td />
      </RefTable.Tr>
      <RefTable.Tr>
        <RefTable.Th>URL link</RefTable.Th>
        <RefTable.Td />
        <RefTable.Td />
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
        <RefTable.Td />
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td>✓*</RefTable.Td>
        <RefTable.Td>✓</RefTable.Td>
      </RefTable.Tr>
    </RefTable>

    <RefTable.Footer>
      <RefTable.FooterItem>
        * Not required, but if exists please include.
      </RefTable.FooterItem>
      <RefTable.FooterItem>
        † Only required for chapter reference.
      </RefTable.FooterItem>
      <RefTable.FooterItem>° Or curator.</RefTable.FooterItem>
      <RefTable.FooterItem>
        § Full publication date required - day/month/year.
      </RefTable.FooterItem>
      <RefTable.FooterItem>
        ‡ Please refer to the software citation principles when citing software.
        If a site suggests a citation should contain a date range, we suggest
        the publication date should be interpreted as the software having been
        developed during the date range, but published at the end of the range.
        Please provide a version of the software.
      </RefTable.FooterItem>
    </RefTable.Footer>
  </React.Fragment>
)

export default RequiredInfoTable
