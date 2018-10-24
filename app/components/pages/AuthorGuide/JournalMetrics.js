import React from 'react'
import { H1, H2 } from '@pubsweet/ui'
import Paragraph from '../../ui/atoms/Paragraph'
import ExternalLink from '../../ui/atoms/ExternalLink'
import { BoxChart, ColumnChart } from './JournalCharts'
import * as data from './JournalCharts.data'

const JournalMetrics = () => (
  <React.Fragment>
    <H1>Journal Metrics</H1>

    <Paragraph>
      We provide the charts below to offer greater transparency about our
      submission volumes and decision times.
    </Paragraph>
    <Paragraph>Last updated: August 20, 2018</Paragraph>

    <H2>1. Number of eLife submissions</H2>
    <Paragraph>
      This shows the number of initial submissions received each quarter. Please
      note that publication fees were introduced on January 1, 2017 (summary
      table{' '}
      <ExternalLink href="https://elife-cdn.s3.amazonaws.com/elifechart1.xlsx">
        Excel
      </ExternalLink>
      ).
    </Paragraph>
    <ColumnChart color="#2369CB" data={data.chart1} />

    <H2>2. Number of research publications</H2>
    <Paragraph>
      This shows the number of research publications each quarter (summary table{' '}
      <ExternalLink href="https://elife-cdn.s3.amazonaws.com/elifechart2.xlsx">
        Excel
      </ExternalLink>
      ).
    </Paragraph>
    <ColumnChart color="#71AC33" data={data.chart2} />

    <H2>3. Decision times before peer review</H2>
    <Paragraph>
      This shows the number of days between receiving the initial submission and
      making a decision on the initial submission (25th, 50th, and 75th
      percentiles; summary table{' '}
      <ExternalLink href="https://elife-cdn.s3.amazonaws.com/elifechart3.xlsx">
        Excel
      </ExternalLink>
      ).
    </Paragraph>
    <BoxChart data={data.chart3} />

    <H2>4. Decision times after peer review</H2>
    <Paragraph>
      This shows the number of days between receiving the full submission and
      making a decision on the full submission, after peer review (25th, 50th,
      and 75th percentiles; summary table{' '}
      <ExternalLink href="https://elife-cdn.s3.amazonaws.com/elifechart4.xlsx">
        Excel
      </ExternalLink>
      ).
    </Paragraph>
    <BoxChart data={data.chart4} />

    <H2>5. Submission to publication</H2>
    <Paragraph>
      This shows the number of days between receiving the initial submission and
      publication (25th, 50th, and 75th percentiles; summary table{' '}
      <ExternalLink href="https://elife-cdn.s3.amazonaws.com/elifechart5.xlsx">
        Excel
      </ExternalLink>
      ). Publish on accept was introduced in April 2014, which allows authors to
      have their accepted manuscript PDF published within a few days. About 60%
      of authors opt for this, with the remaining authors preferring to wait for
      the typeset, author-proofed version.{' '}
    </Paragraph>
    <BoxChart data={data.chart5} />

    <Paragraph>
      In addition to the summary tables, we have made the{' '}
      <ExternalLink href="https://elife-cdn.s3.amazonaws.com/eliferawdata.csv">
        raw data
      </ExternalLink>{' '}
      available to download.
    </Paragraph>
  </React.Fragment>
)

export default JournalMetrics
