#!/usr/bin/env node
const { db } = require('pubsweet-server')
const cleandb = require('pubsweet-server/test/helpers/db_cleaner')

cleandb().then(() => {
  db.destroy()
})
