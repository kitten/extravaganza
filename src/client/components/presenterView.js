import React, { createElement } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #1e2526;

  display: flex;
  flex-direction: row;
  align-items: center;
`

const Column = styled.div`
  display: block;
  padding: 20px 0 20px 0;
`

const SlideContainer = styled.div`
  position: relative;

  background: ${p => p.theme.colors.background};
  color: ${p => p.theme.colors.primary};

  box-shadow: 0 0 24px rgba(0, 0, 0, 0.22), 0 24px 24px rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  overflow: hidden;

  width: ${p => (p.small ? '71.1vh' : '88.9vh')};
  height: ${p => (p.small ? '40vh' : '50vh')};
  margin: 20px;
`

const TheEnd = styled.div`
  background: #000;
  color: #fff;

  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`

const PresenterView = ({ id, slides }) => (
  <Wrapper>
    <Column>
      <SlideContainer>
        {createElement(slides[id])}
      </SlideContainer>

      <SlideContainer small>
        {slides[id + 1] !== undefined
          ? createElement(slides[id + 1])
          : <TheEnd>Fin.</TheEnd>}
      </SlideContainer>
    </Column>
  </Wrapper>
)

export default PresenterView
