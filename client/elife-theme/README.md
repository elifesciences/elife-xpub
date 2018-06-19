# eLife Theme

This theme is based on the values used by the eLife [pattern-library](https://github.com/elifesciences/pattern-library/blob/develop/assets/sass/_variables.scss): see the link for the latest version.

The pattern-library values at time of writing are:

```css
// Colors
$color-primary: #0288d1;
$color-primary-dark: #0277bd;
$color-primary-light: #b3e5fc;

$color-text: #212121;
$color-text-secondary: #888;
$color-text-placeholder: #bdbdbd;
$color-text-dividers: #e0e0e0;
$color-text-ui-background: #fff;
$color-text-ui-background-hue: #f5f5f5;
$color-text-ui-code: #f7f7f7;

$color-text--reverse: #fff;
$color-text-secondary--reverse: #9e9e9e;
// there is no $color-text-placeholder--reverse
$color-text-dividers--reverse: #616161;
$color-text-ui-background--reverse: #212121;
$color-text-ui-background-hue--reverse: #333;

$color-information: #0288d1;
$color-success: #629f43;
$color-success-dark: #569037;
$color-attention: #cf0c4e;

$color-overlay: rgba(0, 0, 0, 0.8);

// Typography
$font-primary: Georgia, serif;
$font-secondary: 'Avenir Next Webfont', Arial, Helvetica, sans-serif;
$font-monospace: 'Courier 10 Pitch', Courier, monospace;
$font-size-base-in-px: 16;
$font-size-h1-in-px: 36;
$font-size-h2-in-px: 26;
$font-size-h3-in-px: 22;
$font-size-h4-in-px: 20;
$font-size-h5-in-px: 18;
$font-size-h6-in-px: 16;
$font-size-caption-in-px: 13;
$box-font-scaling-factor: 0.85;

/*
 * Baseline grid
 */
$blg-space-extra-small-in-px: 12;
$blg-space-small-in-px: $blg-space-extra-small-in-px * 2;
$blg-space-smallish-in-px: $blg-space-small-in-px * 1.5;
$blg-space-medium-in-px: $blg-space-small-in-px * 2;
$blg-space-large-in-px: $blg-space-small-in-px * 3;
$blg-space-extra-large-in-px: $blg-space-small-in-px * 5;

// Widths
$max-width-grid-listing-item: 400;
$max-width-block-link: 600;
$max-width-image-link: $max-width-block-link;
$med-width-grid-listing-item: 263;
$min-width-grid-listing-item: 245;
$grid-listing-spacing-measure: $blg-space-smallish-in-px;

$max-site-width: 1114;
$max-site-width-in-rem: get-rem-from-px($max-site-width);
$viewport-width-when-site-hits-max-width-in-px: 1245;
$viewport-width-when-site-hits-max-width-in-rem: get-rem-from-px(
  $viewport-width-when-site-hits-max-width-in-px
);

// Heights
$audio-player-height: 90;
// TODO: link name with blg spacing for 72px somehow?
$audio-player-height--js: 72;
$content-header-image-height--narrow-screen: 264;
$content-header-image-height--medium-width-screen: 288;
$content-header-image-height--wide-screen: 336;
$content-header-image-credit-height: 48;
$carousel-height: 400;

$button-height-extra-small: 24;
$button-height-small: 36;
$button-height-regular: 48;

// Widths
$content-header-download-width: 20;
$content-header-download-width-medium: 44;
$content-header-profile-width: 48;

$button-speech-bubble-width-in-px: 42;

// Spacing
$teaser-spacing-top: 23;
// 23 not 24 to account for a 1px border (Because of the way the elements are nested, border-box doesn't help us here.)
$teaser-spacing-bottom: 23;
$teaser-spacing-left: 16;
// TODO: link name with blg spacing for 72px somehow?
$listing-list-spacing: 72;

$content-header-padding: 24;

// TODO: rename these
$content-header-side-padding: 6; //vw
$content-header-side-padding--extra-wide: 30; //px

// Breakpoints

$bkpt-site--x-small: 320;
$bkpt-site--small: 480;
$bkpt-site--medium: 730;
$bkpt-site--wide: 900;
$bkpt-site--x-wide: 1200;

// TODO: Replace the use of these with site breakpoints above
$bkpt-content-header--medium-width: $bkpt-site--medium;
$bkpt-content-header--wide: $bkpt-site--wide;
$bkpt-content-header--extra-wide: $bkpt-site--x-wide;

//$bkpt-block-link: 600;
$bkpt-block-link: $bkpt-site--medium;
$bkpt-image-link: $bkpt-block-link;
$bkpt-grid-listing--narrow-screen: $bkpt-block-link;
$bkpt-grid-listing--medium-width: 882;
$bkpt-grid-link-listing--wide-screen: 1174;

$bkpt-captioned-asset-caption: 430;
$bkpt-view-selector: $bkpt-site--x-wide;

// TODO: review these breakpoints:
$bkpt-article-download-links-list: 560;
$bkpt-pull-quote: 560;
$bkpt-section-listing: $bkpt-site--x-wide;

// Borders
$border-radius: 3;
$border-width: 1;

// Animations
$transition-duration: 0.5s;
$transition-delay: 50ms;
$transition-timing-function: ease-in-out;
```
