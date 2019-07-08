const { db } = require('@pubsweet/db-manager')

const createTables = async clobber => {
  const { rows } = await db.raw(`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = current_schema
  `)
  const truncateQuery = `START TRANSACTION;
        ${rows.map(row => `TRUNCATE "${row.tablename}" CASCADE`).join(';')};
        COMMIT`
  await db.raw(truncateQuery)
}

module.exports = createTables
