import styled from 'styled-components'
import base from './base'

const Text = styled.span`
  display: block;
  ${base};
  line-height: ${p => p.lineHeight || 1};
`

export default Text
