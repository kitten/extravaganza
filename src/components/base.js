import { css } from 'styled-components'

import ensureUnit from './utils/ensureUnit'

const base = css`
  font-style: ${p => p.italic ? 'italic' : 'inherit'};
  font-weight: ${p => p.bold ? 'bold' : 'inherit'};
  text-transform: ${p => p.caps ? 'uppercase': 'none'};
  margin: ${p => p.margin ? ensureUnit(p.margin) : 0};
  padding: ${p => p.padding ? ensureUnit(p.padding) : 0};
  color: ${p => p.textColor || 'inherit'};
  font-size: ${p => p.textSize ? ensureUnit(p.textSize) : 'inherit'};
`

export default base
