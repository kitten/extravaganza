import React from 'react'
import styled, { css } from 'styled-components'

import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview
} from 'react-live'

const StyledProvider = styled(LiveProvider)`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
`

const LiveWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  align-items: stretch;
  flex-grow: 1;
`

const column = css`
  flex-basis: 50%;
  width: 50%;
  max-width: 50%;
`

const StyledEditor = styled(LiveEditor)`
  font-family: monospace;
  overflow: scroll;
  box-shadow: inset 6px 0 5px -5px rgba(0, 0, 0, 0.4);

  display: block;
  white-space: pre-wrap;
  font-size: 70%;

  background-color: #1D1F21;
  color: #C5C8C6;

  padding: 0.5rem;
  margin: 0;

  box-sizing: border-box;
  vertical-align: baseline;
  outline: none;
  text-shadow: none;
  -webkit-hyphens: none;
  -ms-hyphens: none;
  hyphens: none;
  word-wrap: normal;
  word-break: normal;
  text-align: left;
  word-spacing: normal;
  -moz-tab-size: 2;
  -o-tab-size: 2;
  tab-size: 2;

  ${column}
  ${p => p.theme.playgroundTheme}
`

const StyledPreview = styled(LivePreview)`
  position: relative;
  padding: 0.5rem;
  background: ${p => p.background || p.theme.colors.background};
  color: ${p => p.textColor || p.theme.colors.primary};
  text-align: center;
  overflow: hidden;

  ${column}
`

const StyledError = styled(LiveError)`
  display: block;
  white-space: pre-wrap;
  font-size: 30%;
  padding: 16px;
  background: #ff5555;
  color: #f8f8f2;
`

const PlaygroundSlide = ({
  textColor,
  background,
  noInline,
  code
}) => (
  <StyledProvider
    code={code}
    noInline={noInline}
    mountStylesheet={false}
  >
    <LiveWrapper>
      <StyledPreview
        background={background}
        textColor={textColor}
      />
      <StyledEditor />
    </LiveWrapper>

    <StyledError />
  </StyledProvider>
)

export default PlaygroundSlide
