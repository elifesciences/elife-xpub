#!/usr/bin/env node
const xml2json = require('xml2json')
const fs = require('fs')

const doCheck = async (xmlFile, minNumber) => {
  const xml = fs.readFileSync(xmlFile, 'utf8')
  const info = JSON.parse(xml2json.toJson(xml))
  console.log(info.testsuites.tests)
  return 1
}

// Run from the command line takes a manuscript id for the first arg.
if (process.argv.length < 4) {
  console.error('Need to supply the xml file and the min number of tests')
  process.exit(1)
}

const xmlFile = process.argv[2]
const minNumber = process.argv[3]

doCheck(xmlFile, minNumber)
