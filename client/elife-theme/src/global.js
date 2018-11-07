import { injectGlobal } from 'styled-components'

injectGlobal`
  /* SemiBold */
  @font-face {
    font-display: fallback;
    font-family: "Noto Sans SemiBold";
    src:
      url('/assets/fonts/NotoSans-SemiBold-webfont-custom-2-subsetting.woff2') format('woff2'),
      url('/assets/fonts/NotoSans-SemiBold-webfont-custom-2-subsetting.woff') format('woff');
  }

  /* Sans */
  @font-face {
    font-display: fallback;
    font-family: "Noto Sans";
    src:
      url('/assets/fonts/NotoSans-Regular-webfont-custom-2-subsetting.woff2') format('woff2'),
      url('/assets/fonts/NotoSans-Regular-webfont-custom-2-subsetting.woff') format('woff');
  }

  /* Serif */
  @font-face {
    font-display: fallback;
    font-family: "Noto Serif";
    src:
      url('/assets/fonts/NotoSerif-Regular-webfont-custom-2-subsetting.woff2') format('woff2'),
      url('/assets/fonts/NotoSerif-Regular-webfont-custom-2-subsetting.woff') format('woff');
  }
`
