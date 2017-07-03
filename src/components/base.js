import { css } from 'styled-components'
import { modularScale } from 'polished'

import ensureUnit from './utils/ensureUnit'
import ensureColour from './utils/ensureColour'

export const getBaseProps = ({
  italic,
  bold,
  caps,
  textColor,
  textSize,
  border,
  margin,
  padding,
  background,
  width,
  height
}) => ({
  italic,
  bold,
  caps,
  textColor,
  textSize,
  border,
  margin,
  padding,
  background,
  width,
  height
})

export const baseFontSize = (defaultStep = 0) => css`
  font-size: ${p => modularScale(p.textSize || defaultStep, '1em', p.theme.slide.fontRatio || 'perfectFourth')};
`

const base = css`
  font-style: ${p => (p.italic ? 'italic' : 'inherit')};
  font-weight: ${p => (p.bold ? 'bold' : 'inherit')};
  text-transform: ${p => (p.caps ? 'uppercase' : 'none')};
  color: ${p => (p.textColor ? ensureColour(p.textColor) : 'inherit')};
  line-height: ${p => p.lineHeight || 1.2};
  vertical-align: middle;

  margin: ${p => (p.margin ? ensureUnit(p.margin) : 0)};
  padding: ${p => (p.padding ? ensureUnit(p.padding) : 0)};
  border: ${p => p.border || 'none'};
  background: ${p => (p.background ? ensureColour(p.background) : 'none')};

  opacity: ${p => p.opacity || 1};

  ${baseFontSize(0)}

  ${p => p.width && css`
    max-width: ${ensureUnit(p.width)};
    width: ${ensureUnit(p.width)};
  `};

  ${p => p.height && css`
    max-height: ${ensureUnit(p.height)};
    height: ${ensureUnit(p.height)};
  `};
`

export default base
