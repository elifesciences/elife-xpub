import { css } from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

// TODO: remove this once themes support icons
const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 8">
    <path fill="#FFF" d="M0 4l1.4-1.4L4 5.2 8.6.6 10 2 4 8z" />
</svg>`

const stepCenter = (isCurrent, isPast) => {
  if (isCurrent) {
    return th('colorBackground')
  } else if (isPast) {
    return th('colorPrimary')
  }
  return th('colorFurniture')
}

export const Steps = {
  Root: css`
    margin-bottom: ${th('space.6')};
    min-width: 0;
  `,

  Step: css`
    height: 20px;
    width: 20px;
    background-color: ${({ isCurrent, isPast }) =>
      stepCenter(isCurrent, isPast)};
    border-color: ${({ isCurrent, isPast }) =>
      isCurrent || isPast ? th('colorPrimary') : th('colorFurniture')};
    border-width: 4px;
  `,

  Separator: css`
    background-color: ${({ isCurrent, isPast }) =>
      isPast ? th('colorPrimary') : th('colorFurniture')};
    height: 4px;
  `,

  StepTitle: css`
    line-height: ${th('lineHeight5')};
    font-size: ${th('fontSizeBaseSmall')};
    color: ${({ isCurrent }) =>
      isCurrent ? th('colorText') : th('colorFurniture')};
  `,

  Bullet: css`
    background-position: center;
    background-size: 10px;
    background-repeat: no-repeat;
    background-color: inherit;
    background-image: url('data:image/svg+xml;utf8,${encodeURIComponent(
      checkIcon,
    )}');
  `,
}
