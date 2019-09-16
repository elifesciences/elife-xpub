import React from 'react'
import { H1, H2 } from '@pubsweet/ui'
import {
  Paragraph,
  NativeLink,
} from '@elifesciences/component-elife-ui/client/atoms'

import { BoxChart, ColumnChart } from './JournalCharts'
import * as data from './JournalCharts.data'

const JournalMetrics = () => (
  <React.Fragment>
    <H1>Journal Metrics</H1>

    <Paragraph.Reading>
      We provide the charts below to offer greater transparency about our
      submission volumes and decision times.
    </Paragraph.Reading>
    <Paragraph.Reading>Last updated: September 16, 2019</Paragraph.Reading>

    <H2>1. Number of eLife submissions</H2>
    <Paragraph.Reading>
      This shows the number of initial submissions received each quarter. Please
      note that publication fees were introduced on January 1, 2017 (summary
      table{' '}
      <NativeLink href="https://elife-cdn.s3.amazonaws.com/elifechart1.xlsx">
        Excel
      </NativeLink>
      ).
    </Paragraph.Reading>
    <ColumnChart color="#2369CB" data={data.chart1} />

    <H2>2. Number of research publications</H2>
    <Paragraph.Reading>
      This shows the number of research publications each quarter (summary table{' '}
      <NativeLink href="https://elife-cdn.s3.amazonaws.com/elifechart2.xlsx">
        Excel
      </NativeLink>
      ).
    </Paragraph.Reading>
    <ColumnChart color="#71AC33" data={data.chart2} />

    <H2>3. Decision times before peer review</H2>
    <Paragraph.Reading>
      This shows the number of days between receiving the initial submission and
      making a decision on the initial submission (25th, 50th, and 75th
      percentiles; summary table{' '}
      <NativeLink href="https://elife-cdn.s3.amazonaws.com/elifechart3.xlsx">
        Excel
      </NativeLink>
      ).
    </Paragraph.Reading>
    <BoxChart data={data.chart3} />

    <H2>4. Decision times after peer review</H2>
    <Paragraph.Reading>
      This shows the number of days between receiving the full submission and
      making a decision on the full submission, after peer review (25th, 50th,
      and 75th percentiles; summary table{' '}
      <NativeLink href="https://elife-cdn.s3.amazonaws.com/elifechart4.xlsx">
        Excel
      </NativeLink>
      ).
    </Paragraph.Reading>
    <BoxChart data={data.chart4} />

    <H2>5. Submission to publication</H2>
    <Paragraph.Reading>
      This shows the number of days between receiving the initial submission and
      publication (25th, 50th, and 75th percentiles; summary table{' '}
      <NativeLink href="https://elife-cdn.s3.amazonaws.com/elifechart5.xlsx">
        Excel
      </NativeLink>
      ). Publish on accept was introduced in April 2014, which allows authors to
      have their accepted manuscript PDF published within a few days. About 60%
      of authors opt for this, with the remaining authors preferring to wait for
      the typeset, author-proofed version.{' '}
    </Paragraph.Reading>
    <BoxChart data={data.chart5} />

    <Paragraph.Reading>
      In addition to the summary tables, we have made the{' '}
      <NativeLink href="https://elife-cdn.s3.amazonaws.com/eliferawdata.xlsx">
        raw data
      </NativeLink>{' '}
      available to download.
    </Paragraph.Reading>
  </React.Fragment>
)

export default JournalMetrics
