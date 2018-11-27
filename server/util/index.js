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

module.exports = {
  logConfigSources
}
