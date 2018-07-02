import config from 'config'

const dashboard = {
  url: `${config.get('pubsweet-server.baseUrl')}`,
  titles: '[data-test-id=title]',
  stages: '[data-test-id=stage]',
}

export default dashboard
