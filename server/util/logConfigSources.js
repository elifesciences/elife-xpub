#!/usr/bin/env node

const config = require('config')

const logConfigSources = log => {
  const configSources = config.util.getConfigSources()
    .map(source => source.name)

  configSources.shift()

  log(`Loaded the following config:\n${
    configSources
      .map(source => `- ${source}`)
      .join('\n')
  }`)
}

if (require.main === module) {
  logConfigSources(console.log)
}


module.exports = logConfigSources
