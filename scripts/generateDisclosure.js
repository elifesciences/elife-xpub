#!/usr/bin/env node
const fs = require('fs')
const generateDisclosurePdf = require('../server/meca/file-generators/disclosure')
const Manuscript = require('@elifesciences/component-model-manuscript').model
const { db } = require('pubsweet-server')

async function regenerate(id) {
  console.log(id)

  const [manuscript] = await Manuscript.query().where({
    'manuscript.id': id,
  })

  let doc = null
  try {
    await manuscript.$loadRelated('[teams]')
    doc = await generateDisclosurePdf(manuscript, 'no-ip-address')

    const filename = `disclosure-${id}.pdf`
    fs.writeFile(filename, doc, err => {
      if (err) {
        return console.error(err)
      }
      console.log(`Written: ${filename}`)
      return true
    })
  } catch (err) {
    console.error(err)
  } finally {
    // we need to do this whenever we use the xpub-model in order that the
    // process cleanly exits.
    db.destroy()
  }
}

// Run from the command line takes a manuscript id for the first arg.
if (process.argv.length < 3 || !process.argv[2]) {
  console.error('Need to supply a manuscript id as an argument!')
  process.exit(1)
}

const id = process.argv[2]

if (id.length !== 36) {
  console.error('That does not look like a manuscript id')
  process.exit(1)
}

regenerate(id)
