import { css } from 'styled-components'

export const getFlexProps = ({
  flexDirection,
  justifyContent,
  alignItems,
  alignContent,
  alignSelf,
  flexWrap
}) => ({
  flexDirection,
  justifyContent,
  alignItems,
  alignContent,
  alignSelf,
  flexWrap
})

const flex = (direction = 'row') => css`
  display: flex;

  flex-direction: ${p => p.flexDirection || direction};
  justify-content: ${p => p.justifyContent || 'center'};
  align-items: ${p => p.alignItems || 'center'};
  align-content: ${p => p.alignContent || 'stretch'};
  align-self: ${p => p.alignSelf || 'auto'};
  flex-wrap: ${p => p.flexWrap || 'no-wrap'};
`

export default flex
