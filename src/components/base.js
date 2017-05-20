import { css } from 'styled-components'

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

const base = css`
  font-style: ${p => (p.italic ? 'italic' : 'inherit')};
  font-weight: ${p => (p.bold ? 'bold' : 'inherit')};
  text-transform: ${p => (p.caps ? 'uppercase' : 'none')};
  color: ${p => (p.textColor ? ensureColour(p.textColor) : 'inherit')};
  font-size: ${p => (p.textSize ? ensureUnit(p.textSize) : 'inherit')};
  border: ${p => p.border || 'none'};

  margin: ${p => (p.margin ? ensureUnit(p.margin) : 0)};
  padding: ${p => (p.padding ? ensureUnit(p.padding) : 0)};
  background: ${p => (p.background ? ensureColour(p.background) : 'none')};

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
