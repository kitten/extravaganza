import React, { Component } from 'react'
import styled, { withTheme } from 'styled-components'

import base, { getBaseProps } from './base'
import flex, { getFlexProps } from './flex'
import ensureUnit from './utils/ensureUnit'

const baseHeight = 1080

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  ${base}
`

const Content = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;

  height: ${baseHeight}px;
  width: ${p => (p.theme.slide.aspectRatio || 4 / 3) * baseHeight}px;
  padding: ${p => ensureUnit(p.theme.slide.padding || 50)};
  text-align: left;
  overflow: hidden;

  transform-origin: 50% 50%;
  transform: translate(-50%, -50%) scale(${p => p.scale});
  z-index: 10;

  ${flex('column')}
`

class Slide extends Component {
  state = { scale: 1 }

  saveContentRef = node => {
    this.contentRef = node
  }

  fit = () => {
    const { contentRef } = this

    if (contentRef === null || contentRef === undefined) {
      return
    }

    const { aspectRatio } = this.props.theme
    const baseWidth = (aspectRatio || 4 / 3) * baseHeight

    const outerWidth = contentRef.parentNode.offsetWidth
    const outerHeight = contentRef.parentNode.offsetHeight
    const isLandscape = outerWidth > outerHeight

    const scale = isLandscape
      ? outerHeight / baseHeight
      : outerWidth / baseWidth

    this.setState({ scale })
  }

  componentDidMount() {
    this.fit()
    window.addEventListener('load', this.fit)
    window.addEventListener('resize', this.fit)
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.fit)
    window.removeEventListener('resize', this.fit)
  }

  render() {
    const { renderBackground, children } = this.props
    const { scale } = this.state

    return (
      <Wrapper {...getBaseProps(this.props)}>
        <Content
          innerRef={this.saveContentRef}
          scale={scale}
          {...getFlexProps(this.props)}
        >
          {children}
        </Content>

        {typeof renderBackground === 'function'
          ? renderBackground({ scale })
          : undefined}
      </Wrapper>
    )
  }
}

export default withTheme(Slide)
