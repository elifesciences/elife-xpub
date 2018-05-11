import React from 'react'
import TextureApp from './TextureApp'
import TextureContainer from './TextureContainer'

class TextureEditor extends React.Component {
  componentDidMount() {
    // substanceGlobals.DEBUG_RENDERING = platform.devtools
    TextureApp.mount(this.state, this.ref)
  }

  setRef = ref => (this.ref = ref)

  static getDerivedStateFromProps(nextProps) {
    return nextProps
  }

  render() {
    return <TextureContainer innerRef={this.setRef} />
  }
}

export default TextureEditor
