import { css } from 'styled-components'

const base = css`
  font-style: ${p => p.italic ? 'italic' : 'inherit'};
  font-weight: ${p => p.bold ? 'bold' : 'inherit'};
  text-transform: ${p => p.caps ? 'uppercase': 'none'}
  margin: ${p => p.margin};
  padding: ${p => p.padding};
  color: ${p => p.textColor || 'inherit'};
  font-size: ${p => p.textSize || 'inherit'};
`

export default base
