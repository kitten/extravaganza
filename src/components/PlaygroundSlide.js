import React, { Component } from 'react'
import styled, { css } from 'styled-components'

import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview
} from 'react-live'

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  padding: 2rem;
`

const Provider = styled(LiveProvider)`
  display: flex;
  flex-direction: row;
  align-items: stretch;

  height: 100%;
  width: 100%;
  border-radius: 6px;
  overflow: hidden;

  border: 1px solid #999;
`;

const Column = styled.div`
  position: relative;
  height: 100%;
  width: 50%;
  flex-basis: 50%;
  flex-shrink: 0;

  &:last-child {
    border-left: 1px solid #333;
  }
`

const Preview = styled(LivePreview)`
  padding: 0.5rem;
  height: 100%;
  background: #fff;
  color: #333;
`;

const Editor = styled(LiveEditor)`
  padding: 0.5rem;
  margin: 0;
  min-height: 100%;
  font-size: 1.15vw;

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

  color: rgba(233, 237, 237, 1);
  background: #263238;

  ${p => p.theme.playgroundTheme}
`;

const Title = styled.div`
  width: 100%;
  height: 1.7rem;
  line-height: 1.7rem;
  vertical-align: middle;

  background: #272822;
  border-bottom: 1px solid #333;
  color: #fff;

  display: block;
  font-size: 0.8rem;
  padding: 0 0.4rem;
  text-transform: uppercase;

  ${p => p.light && css`
    background: #ddd;
    border-bottom: 1px solid #999;
    color: #424242;
  `}
`;

const Error = styled(LiveError)`
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: left;
  white-space: pre-wrap;
  font-size: 1vw;

  background: rgba(255, 35, 36, 0.8);
  color: white;
  padding: 0.4rem;
`;

const PlaygroundSlide = ({
  textColor,
  background,
  noInline,
  code,
  scope
}) => (
  <Wrapper>
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
  </Wrapper>
)

export default PlaygroundSlide
