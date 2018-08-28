import React from 'react'
import { TextureWebApp } from 'substance-texture'

import 'substance/dist/substance.css'
import 'substance-texture/dist/texture.css'
import 'substance-texture/dist/font-awesome/css/font-awesome.css'
import TextureContainer from './TextureContainer'

class TextureEditor extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    return {
      storageUrl: `/api/dar`,
      ...nextProps,
    }
  }

  componentDidMount() {
    TextureWebApp.mount(this.state, this.ref)
  }

  setRef = ref => (this.ref = ref)

  render() {
    return <TextureContainer innerRef={this.setRef} />
  }
}

export default TextureEditor
