/* eslint-disable import/extensions */
import './fonts/index.css'
import * as elements from './elements'
import * as icons from './icons'

const gridUnit = 6

export default {
  /* Colors */
  colorBackground: '#fff',
  colorPrimary: '#0288d1',
  colorSecondary: '#f7f7f7',
  colorFurniture: '#E0E0E0',
  colorBorder: '#E0E0E0',
  /* marginally darker shade of the app background so that it can be used to divide the interface when needed */
  colorBackgroundHue: '#f7f7f7',
  colorSuccess: '#629f43',
  colorError: '#cf0c4e',
  colorWarning: '#e65100',
  colorText: '#212121',
  colorTextSecondary: '#888',
  colorTextPlaceholder: '#bdbdbd',
  colorTextReverse: '#fff',

  /* Text variables */
  fontInterface: '"Noto Sans", Arial, Helvetica, sans-serif',
  fontHeading: '"Noto Sans SemiBold", Arial, Helvetica, sans-serif',
  fontReading: '"Noto Serif", serif',
  fontWriting: '"Noto Sans", Arial, Helvetica, sans-serif',
  fontSizeBase: '16px',
  fontSizeBaseSmall: '14px',
  fontSizeHeading1: '30px',
  fontSizeHeading2: '22px',
  fontSizeHeading3: '18px',
  fontSizeHeading4: '16px',
  fontSizeHeading5: '14px',
  fontSizeHeading6: '12px',
  fontLineHeightBase: '24px',
  fontLineHeightBaseSmall: '18px',
  fontLineHeight1: '36px',
  fontLineHeight2: '30px',
  fontLineHeight3: '24px',
  fontLineHeight4: '24px',
  fontLineHeight5: '18px',
  fontLineHeight6: '16px',

  /* Spacing */
  gridUnit: `${gridUnit}px`,
  /**
   * 0 = 0px
   * 1 = XXS = 6px
   * 2 = XS  = 12px
   * 3 = S   = 24px
   * 4 = M   = 36px
   * 5 = L   = 48px
   * 6 = XL  = 72px
   * 7 = XXL = 120px
   */
  space: [0, 1, 2, 4, 6, 8, 12, 20].map(factor => `${factor * gridUnit}px`),

  breakpoints: [480, 768, 1000, 1272],

  /* Border */
  borderRadius: '3px',
  borderWidth: '1px',
  borderStyle: 'solid',

  /* Shadow (for tooltip) */
  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.30)',

  /* Transition */
  transitionDuration: '0.2s',
  transitionTimingFunction: 'ease',
  transitionDelay: '0',

  cssOverrides: {
    ...elements,
    'xpub-edit': elements.xpubEdit,
  },

  icons: {
    '@pubsweet-pending.PeoplePicker.PersonPod.add': icons.Plus,
    '@pubsweet-pending.PeoplePicker.PersonPod.remove': icons.RubbishBin,
    '@pubsweet-pending.PeoplePicker.PersonPod.selected': icons.SelectedTick,
    '@pubsweet-pending.FileUploads.Editor.bold': icons.TextBold,
    '@pubsweet-pending.FileUploads.Editor.italic': icons.TextItalic,
    '@pubsweet-pending.FileUploads.Editor.underline': icons.TextUnderline,
    '@pubsweet-pending.FileUploads.Editor.sub': icons.TextSub,
    '@pubsweet-pending.FileUploads.Editor.sup': icons.TextSup,
  },
}

export { icons }

export { default as UploadIcon } from './icons/Upload'
export { default as UploadSuccessIcon } from './icons/UploadSuccess'
export { default as UploadFailureIcon } from './icons/UploadFailure'
export { default as CrossIcon } from './icons/Cross'
export { default as SearchIcon } from './icons/Search'
