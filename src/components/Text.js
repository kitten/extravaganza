import styled from 'styled-components'
import base from './base'

const Text = styled.span`
  line-height: ${p => p.lineHeight || 1};
  ${base}
`

export default Text
