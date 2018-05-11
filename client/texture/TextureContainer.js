import styled from 'styled-components'

const TextureContainer = styled.div`
  // TODO size this properly - 85px is the height of the navbar
  height: calc(100vh - 85px);

  .sc-app {
    height: 100%;
  }

  /* variables from texture-pagestyle.css
  ---------------------------------------*/

  /* Layout */
  --small-layout-width: 300px;
  --medium-layout-width: 620px;
  --large-layout-width: 960px;

  /* Normalized heights (used by buttons and inputs) */
  --base-height: 40px;
  --short-height: 20px;
  --border-radius: 5px;

  /* Colors */
  --dark-bg-color: #2e2e2e;
  --border-color: #e0e4e4;
  --dark-border-color: #777;

  /* Used by Button component */
  --button-color: rgba(0, 0, 0, 0.75);

  --fill-white-color: #fff;
  --fill-light-color: #f7f9f9; /* #f8f8f8; */
  --fill-dark-color: #404040;

  --default-box-shadow: 0 0 0 0.75pt #d1d1d1, 0 0 3pt 0.75pt #aaa;

  /* Depending on a base-color */
  --darken-color-1: rgba(0, 0, 0, 0.05);
  --darken-color-2: rgba(0, 0, 0, 0.1);
  --darken-color-3: rgba(0, 0, 0, 0.25);
  --darken-color-4: rgba(0, 0, 0, 0.5);
  --darken-color-5: rgba(0, 0, 0, 0.75);

  --lighten-color-1: rgba(0, 0, 0, 0.05);
  --lighten-color-2: rgba(0, 0, 0, 0.1);
  --lighten-color-3: rgba(0, 0, 0, 0.25);
  --lighten-color-4: rgba(0, 0, 0, 0.5);
  --lighten-color-5: rgba(0, 0, 0, 0.75);

  --link-color: #1795cd;

  --text-action-color: #2e72ea;
  --border-action-color: #2e72ea;
  --light-bg-color: #f7f7f9; /* light grey */
  --active-color: #2e72ea;
  --active-light-bg-color: #2e72ea0a;
  --separator-color: rgba(0, 0, 0, 0.05);

  /* We disable this for now, as accessibility needs more discussion */
  --focus-outline-color: transparent; /* #1795CD;/* #5BE3FF;

  /* Font colors */
  --default-text-color: rgba(0, 0, 0, 0.75);
  --light-text-color: rgba(0, 0, 0, 0.4);

  /* Default padding */
  --default-padding: 20px;

  /* Prose font sizes */
  --default-font-size: 16px;
  --small-font-size: 13px;

  --large-font-size: 20px;
  --xlarge-font-size: 25px;
  /* Title font sizes */
  --title-font-size: 38px;
  /* Heading font sizes */
  --h1-font-size: 26px;
  --h2-font-size: 22px;
  --h3-font-size: 18px;
  --h4-font-size: 16px;

  --strong-font-weight: 600;
  --highlight-color-1: #0b9dd9;
  --highlight-color-2: #91bb04;
  --heading-letterspacing: -0.5px;

  /* code-font */
  --font-family-code: Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  --font-size-code: 14px;

  /* RGB #A3CDFD = HSB 209,29,80 */
  --local-selection-color: #2a8cff;

  /* adapted from texture-reset.css
  ------------------------------------------------ */

  ol,
  ul {
    /*list-style:none;*/
    margin: 0;
  }

  blockquote,
  q {
    quotes: none;
  }

  blockquote:before,
  blockquote:after,
  q:before,
  q:after {
    content: none;
  }

  /* tables still need 'cellspacing="0"' in the markup */

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  /* remember to define focus styles. */

  & :focus {
    outline: 0;
  }

  *,
  *:after,
  *:before {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  /* Reset \`button\` and button-style \`input\` default styles */

  input[type='submit'],
  input[type='reset'],
  input[type='button'],
  button {
    background: none;
    border: 0;
    color: inherit;
    cursor: pointer;
    font: inherit;
    line-height: normal;
    overflow: visible;
    padding: 0;
    display: block;
    text-align: left;
    -webkit-appearance: button; /* for input */
    -webkit-user-select: none; /* for button */
    -moz-user-select: none;
    -ms-user-select: none;
  }

  input::-moz-focus-inner,
  button::-moz-focus-inner {
    border: 0;
    padding: 0;
  }
`

export default TextureContainer
