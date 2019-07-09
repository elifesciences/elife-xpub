#!/usr/bin/env node
const xml2json = require('xml2json')
const fs = require('fs')

const doCheck = (xmlFile, minNumber) => {
  const xml = fs.readFileSync(xmlFile, 'utf8')
  const info = JSON.parse(xml2json.toJson(xml))
  const number = Number(info.testsuites.tests)
  console.info(`Executed ${number} tests`)
  process.exit(number >= minNumber ? 0 : 2)
}

if (process.argv.length < 4) {
  console.error('Checks a JUnit XML report contains a minimum number of tests')
  console.error(`Usage: node ${process.argv[1]} PATH_TO_REPORT MINIMUM_NUMBER`)
  console.error(
    `Example: node ${process.argv[1]}  build/jest-junit/unit-tests.xml 400`,
  )
  process.exit(1)
}

const xmlFile = process.argv[2]
const minNumber = process.argv[3]

process.exit(doCheck(xmlFile, minNumber))
