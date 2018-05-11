import { TextureWebApp } from 'substance-texture'

import 'substance/dist/substance.css'
import 'substance-texture/dist/texture.css'
import 'substance-texture/dist/font-awesome/css/font-awesome.css'

const mockClient = {
  read: async archiveId => {
    const response = await fetch(
      `https://tamlyn.s3.amazonaws.com/manuscripts/${archiveId}`,
    )
    const xml = await response.text()

    return {
      resources: {
        'manifest.xml': {
          encoding: 'utf8',
          data: `
<dar>
    <documents>
        <document id="manuscript" type="article" path="manuscript.xml"/>
    </documents>
    <assets/>
</dar>`,
        },

        'manuscript.xml': {
          encoding: 'utf8',
          data: xml,
        },
      },
    }
  },
}

// NOTE this is a Substance component, not a React component
class TextureApp extends TextureWebApp {
  // eslint-disable-next-line class-methods-use-this
  _getStorage() {
    return mockClient
  }
}

export default TextureApp
