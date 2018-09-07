/* eslint-disable import/extensions */
import global from './global';
import * as elements from './elements'
import * as icons from './icons'

global();

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
  lineHeightBase: '24px',
  lineHeightBaseSmall: '18px',
  lineHeight1: '36px',
  lineHeight2: '30px',
  lineHeight3: '24px',
  lineHeight4: '24px',
  lineHeight5: '18px',
  lineHeight6: '16px',

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
    '@pubsweet-pending.PeoplePicker.PersonPod.Add': icons.Add,
    '@pubsweet-pending.PeoplePicker.PersonPod.Remove': icons.Trash,
    '@pubsweet-pending.PeoplePicker.PersonPod.Selected': icons.CheckCircle,
    '@pubsweet-pending.FilesPage.Editor.Bold': icons.FormatBold,
    '@pubsweet-pending.FilesPage.Editor.Italic': icons.FormatItalic,
    '@pubsweet-pending.FilesPage.Editor.Underlined': icons.FormatUnderlined,
    '@pubsweet-pending.FilesPage.Editor.Subscript': icons.FormatSubscript,
    '@pubsweet-pending.FilesPage.Editor.Superscript': icons.FormatSuperscript,
    '@pubsweet-pending.PeoplePicker.Search': icons.Search,
    '@pubsweet-pending.FileUpload.Upload': icons.Upload,
    '@pubsweet-pending.FileUpload.UploadFailure': icons.UploadFailure,
    '@pubsweet-pending.FileUpload.UploadSuccess': icons.UploadSuccess,
    '@pubsweet-pending.MultiselectDropdown': icons.Cross,
    '@pubsweet-pending.Tags.Remove': icons.Cross,
    '@pubsweet-pending.CalloutBox.CloseIcon': icons.Cross,
  },
}

export { icons }
