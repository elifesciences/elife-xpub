import config from 'config'

const dashboard = {
  url: `${config.get('pubsweet-server.baseUrl')}`,
}

export default dashboard
