import { css } from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

export default css`
  margin-bottom: 100px;
`

const stepCenter = (isCurrent, isPast) => {
  if (isCurrent) {
    return '#fff'
  } else if (isPast) {
    return th('colorPrimary')
  }
  return th('colorFurniture')
}

export const Steps = {
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
    line-height: ${th('fontLineHeight5')};
    font-size: ${th('fontSizeBaseSmall')};
    color: ${({ isCurrent }) =>
      isCurrent ? th('colorText') : th('colorFurniture')};
  `,

  Bullet: css`
    visibility: hidden;
  `,
}
