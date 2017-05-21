import React, { createElement } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
  background: #1e2526;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
`

const Link = styled.div`
  margin: 20px;
  cursor: pointer;
  transition: transform 0.15s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`

const SlideContainer = styled.div`
  position: relative;

  background: ${p => p.theme.colors.background};
  color: ${p => p.theme.colors.primary};
  border: 1px solid ${p => p.theme.colors.background};

  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.35);
  border-radius: 3px;
  overflow: hidden;

  width: 22vw;
  height: 12.375vw;
  pointer-events: none;
`

const Overview = ({ slides }, { slideManager }) => (
  <Wrapper>
    {slides.map((component, index) => (
      <Link onClick={() => slideManager.goto(index)} key={index}>
        <SlideContainer>
          {createElement(component)}
        </SlideContainer>
      </Link>
    ))}
  </Wrapper>
)

Overview.contextTypes = {
  slideManager: PropTypes.object
}

export default Overview
