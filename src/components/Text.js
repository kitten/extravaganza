import styled from 'styled-components'
import base from './base'

const Text = styled.span`
  ${base};
  line-height: ${p => p.lineHeight || 1};
`

export default Text
