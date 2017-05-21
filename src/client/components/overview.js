import React, { createElement } from 'react'
import styled from 'styled-components'
import history from './history'

const Wrapper = styled.div`
  background: #1e2526;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
`

const SlideContainer = styled.div`
  display: block;
  position: relative;

  background: ${p => p.theme.colors.background};
  color: ${p => p.theme.colors.primary};

  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.22);
  border-radius: 3px;
  overflow: hidden;

  width: 22vw;
  height: 12.375vw;
  margin: 20px;

  cursor: pointer;
  pointer-events: none;
  transition: transform 0.15s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`

const Overview = ({ slides }) => (
  <Wrapper>
    {slides.map((component, index) => (
      <SlideContainer onClick={() => history.push(`/${index}`)} key={index}>
        {createElement(component)}
      </SlideContainer>
    ))}
  </Wrapper>
)

export default Overview
