/* eslint-disable react/jsx-sort-props */
import React from 'react'
import { H1, H2 } from '@pubsweet/ui'
import { Paragraph } from '@elifesciences/component-elife-ui/client/atoms'
import ChartEmbed from './ChartEmbed'

const JournalMetrics = () => (
  <React.Fragment>
    <H1>Journal Metrics</H1>

    <Paragraph.Reading>
      We provide the charts below to offer greater transparency about our
      submission volumes and decision times.
    </Paragraph.Reading>

    <H2>1. Number of eLife submissions</H2>
    <Paragraph.Reading>
      This shows the number of initial submissions received each quarter.{' '}
    </Paragraph.Reading>
    <ChartEmbed
      height={358}
      src="https://datastudio.google.com/embed/reporting/1SrhoP4-CMFcXOCrtb2SGaYiGXg77e3o4/page/d5wu?hl=en"
      width={668}
    />

    <H2>2. Number of research publications</H2>
    <Paragraph.Reading>
      This shows the number of research publications each quarter.{' '}
    </Paragraph.Reading>
    <ChartEmbed
      height={358}
      src="https://datastudio.google.com/embed/reporting/1SrhoP4-CMFcXOCrtb2SGaYiGXg77e3o4/page/VAxu?hl=en"
      width={668}
    />

    <H2>3. Decision times before peer review</H2>
    <Paragraph.Reading>
      This shows the number of days between receiving the initial submission and making a decision on the 
  initial submission (25th, 50th, and 75th percentiles).{' '}
    </Paragraph.Reading>
    <ChartEmbed
      height={358}
      src="https://datastudio.google.com/embed/reporting/1SrhoP4-CMFcXOCrtb2SGaYiGXg77e3o4/page/zRau?hl=en"
      width={668}
    />

    <H2>4. Decision times after peer review</H2>
    <Paragraph.Reading>
      This shows the number of days between receiving the full submission and making a decision on the full 
      submission, after peer review (25th, 50th, and 75th percentiles).{' '}
    </Paragraph.Reading>
    <ChartEmbed
      height={358}
      src="https://datastudio.google.com/embed/reporting/1SrhoP4-CMFcXOCrtb2SGaYiGXg77e3o4/page/Bewu?hl=en"
      width={668}
    />

    <H2>5. Submission to publication</H2>
    <Paragraph.Reading>
      This shows the number of days between receiving the initial submission and publication (25th, 50th, and 75th percentiles).{' '}
    </Paragraph.Reading>
    <ChartEmbed
      height={358}
      src="https://datastudio.google.com/embed/reporting/1SrhoP4-CMFcXOCrtb2SGaYiGXg77e3o4/page/7ewu?hl=en"
      width={668}
    />
  </React.Fragment>
)

export default JournalMetrics
