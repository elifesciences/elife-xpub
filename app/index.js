import React from 'react'
import styled from 'styled-components'
import ReactDOM from 'react-dom'
import App from './app'
import { version, date } from './version.json'

/*
The Footer component is a temporary stop-gap while we are still
undergoing heavy development to ensure we know what we are looking at!
*/
const Footer = styled.div`
  margin: 40px;
  text-align: right;
  color: DarkGrey;
  font-size: 14px;
  border-top: 1px solid LightGrey;
`

ReactDOM.render(
  <React.Fragment>
    <App />
    <Footer>
      Date: {date} - Commit: {version.substring(0, 7)}
    </Footer>
  </React.Fragment>,
  document.getElementById('root'),
)
