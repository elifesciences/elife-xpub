```js
class Wrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = { toggle: false }
  }

  render() {
    return (
      <React.Fragment>
        <button onClick={() => this.setState({ toggle: !this.state.toggle })}>
          {this.state.toggle ? 'Hide' : 'Show'}
        </button>
        {this.state.toggle && this.props.children}
      </React.Fragment>
    )
  }
}

;<Wrapper>
  <FooterMessage>Hello World</FooterMessage>
</Wrapper>
```
