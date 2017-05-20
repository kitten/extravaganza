import styled from 'styled-components'

import base from './base'
import flex from './flex'
import ensureUnit from './utils/ensureUnit'

const View = styled.div`
  position: ${p => p.position || 'relative'};

  ${flex('row')}

  flex-direction: ${p => p.flexDirection || 'row'};
  justify-content: ${p => p.justifyContent || 'center'};
  align-items: ${p => p.alignItems || 'center'};
  align-content: ${p => p.alignContent || 'stretch'};
  align-self: ${p => p.alignSelf || 'auto'};
  flex-wrap: ${p => p.flexWrap || 'no-wrap'};

  top: ${p => (p.top ? ensureUnit(p.top) : '0')};
  right: ${p => (p.right ? ensureUnit(p.right) : '0')};
  bottom: ${p => (p.bottom ? ensureUnit(p.bottom) : '0')};
  left: ${p => (p.left ? ensureUnit(p.left) : '0')};

  flex: ${p => p.flex || 'none'};
  flex-basis: ${p => p.flexBasis || 'auto'};
  flex-grow: ${p => p.flexGrow || 0};
  flex-shrink: ${p => p.flexShrink || 1};

  z-index: ${p => p.zIndex || 0};

  ${base}
`

export default View
