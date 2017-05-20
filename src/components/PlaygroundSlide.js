import React, { Component } from 'react'
import styled, { css } from 'styled-components'

import base, { baseFontSize } from './base'
import Slide from './Slide'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'

const Provider = styled(LiveProvider)`
  display: flex;
  flex-direction: row;
  align-items: stretch;

  height: 100%;
  width: 100%;
  border-radius: 6px;
  overflow: hidden;

  ${base}
  ${baseFontSize(-2)}

  border: 1px solid rgba(0, 0, 0, 0.3);
`

const Column = styled.div`
  position: relative;
  height: 100%;
  width: 50%;
  flex-basis: 50%;
  flex-shrink: 0;

  &:last-child {
    border-left: 1px solid rgba(0, 0, 0, 0.3);
  }
`

const Preview = styled(LivePreview)`
  padding: 0.5rem;
  height: 100%;
  background: #fff;
  color: #333;
  overflow-y: scroll;
`

const Editor = styled(LiveEditor)`
  padding: 0.5rem;
  margin: 0;
  min-height: 100%;

  white-space: pre-wrap;
  box-sizing: border-box;
  vertical-align: baseline;
  outline: none;
  text-shadow: none;
  hyphens: none;
  word-wrap: normal;
  word-break: normal;
  text-align: left;
  word-spacing: normal;
  tab-size: 2;
  overflow-y: scroll;

  color: rgba(233, 237, 237, 1);
  background: #263238;

  ${p => p.theme.playgroundTheme}
`

const Title = styled.div`
  width: 100%;

  background: #272822;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  color: #fff;

  display: block;
  padding: 0.2em 0;

  ${p => p.light && css`
    background: #ddd;
    border-bottom: 1px solid #999;
    color: #424242;
  `}
`

const Error = styled(LiveError)`
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: left;
  white-space: pre-wrap;

  background: rgba(255, 35, 36, 0.8);
  color: white;
  padding: 0.4rem;
`

const PlaygroundSlide = ({ textColor, background, noInline, code, scope }) => (
  <Slide>
    <Provider
      mountStylesheet={false}
      code={code.trim()}
      scope={{ Component, ...scope }}
      noInline={noInline}
    >
      <Column>
        <Title light>Live Preview</Title>
        <Preview />
        <Error />
      </Column>

      <Column>
        <Title>Source Code</Title>
        <Editor />
      </Column>
    </Provider>
  </Slide>
)

export default PlaygroundSlide
