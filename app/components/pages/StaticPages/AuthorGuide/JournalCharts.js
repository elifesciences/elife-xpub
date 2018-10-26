import React from 'react'
import styled from 'styled-components'
import { Chart } from 'react-google-charts'
import { th } from '@pubsweet/ui-toolkit'

const ChartBox = styled.div`
  border: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  &:not(:last-child) {
    margin-bottom: ${th('space.5')};
  }
`

export const ColumnChart = ({ data, color }) => (
  <ChartBox>
    <Chart
      chartType="ColumnChart"
      data={data}
      height={350}
      options={{
        chartArea: { width: '80%' },
        colors: [color],
        fontSize: 11,
        hAxis: { slantedText: true },
        legend: 'none',
      }}
      width={650}
    />
  </ChartBox>
)

function getBoxPlotValues(data) {
  return [
    [
      { type: 'string', label: 'x' },
      // { type: 'number', label: 'Minimum' },
      { type: 'number', label: 'Median' },
      { type: 'number', label: '25th', role: 'interval' },
      { type: 'number', label: '75th', role: 'interval' },
      // { type: 'number', label: 'Maximum' },
    ],
  ].concat(data.map(row => [row[0], row[3], row[2], row[4]]))
}

export const BoxChart = ({ data }) => (
  <ChartBox>
    <Chart
      chartType="LineChart"
      data={getBoxPlotValues(data)}
      height={350}
      options={{
        chartArea: { width: '80%' },
        fontSize: 11,
        hAxis: { slantedText: true },
        intervals: {
          barWidth: 0.5,
          boxWidth: 0.5,
          color: '#730073',
          lineWidth: 2,
          style: 'boxes',
        },
        legend: 'none',
      }}
      width={650}
    />
  </ChartBox>
)
