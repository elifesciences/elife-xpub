import { css } from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

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
    line-height: ${th('fontLineHeight5')};
    font-size: ${th('fontSizeBaseSmall')};
    color: ${({ isCurrent }) =>
      isCurrent ? th('colorText') : th('colorFurniture')};
  `,

  Bullet: css`
    background-position: center;
    background-repeat: no-repeat;
    background-color: inherit;
    background-image: url("data:image/svg+xml;utf8,<?xml version='1.0' encoding='UTF-8'?><svg width='10px' height='8px' viewBox='0 0 10 8' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><!-- Generator: Sketch 50.2 (55047) - http://www.bohemiancoding.com/sketch --><title>stepper-tick-icon</title><desc>Created with Sketch.</desc><defs></defs><g id='Symbols' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g id='atoms/step-complete' transform='translate(-5.000000, -6.000000)'><g id='stepper-tick-icon' transform='translate(4.000000, 4.000000)'><rect id='Rectangle' x='0' y='0' width='12' height='12'></rect><polygon id='Shape' fill='%23FFFFFF' points='1 6 2.4 4.6 5 7.2 9.6 2.6 11 4 5 10'></polygon></g></g></g></svg>");
  `,
}
