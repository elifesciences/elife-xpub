#!/usr/bin/env node
const { db } = require('@pubsweet/db-manager')
const cleandb = require('pubsweet-server/test/helpers/db_cleaner')

cleandb().then(() => {
  db.destroy()
})
