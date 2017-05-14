import React, { Component } from 'react'
import styled, { css } from 'styled-components'

import base from './base'
import ensureUnit from './utils/ensureUnit'

const Outer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;

  background: ${(
    p => p.background || p.theme.colors.background
  )};

  ${base}
`

const Inner = styled.div`
  display: flex;
  position: relative;
  flex: 1;

  align-items: ${(
    p => p.align ?
      p.align.split(' ')[1] :
      'center'
  )};

  justify-content: ${(
    p => p.align ?
      p.align.split(' ')[0] :
      'center'
  )};
`

const Content = styled.div`
  flex: 1;
  max-height: ${p => p.maxHeight ? ensureUnit(p.maxHeight) : '700px'};
  max-width: ${p => p.maxWidth ? ensureUnit(p.maxWidth) : '1000px'};
  transform: scale(${p => p.scale});
  padding: ${p => ensureUnit(p.zoom > 0.6 ? (p.margin || 40) : 10)};
  text-align: center;
`

class Slide extends Component {
  state = {
    scale: 1,
    zoom: 1
  }

  zoom = () => {
    const mobile = window.matchMedia("(max-width: 628px)").matches
    const content = this.contentRef

    if (content) {
      const zoom = content.offsetWidth / 1000

      const contentScaleY = content.parentNode.offsetHeight / 700
      const contentScaleX = content.parentNode.offsetWidth / 700
      const minScale = Math.min(contentScaleY, contentScaleX)
      const scale = mobile ? 1 : (minScale < 1 ? minScale : 1)

      this.setState({
        zoom: Math.max(zoom, 0.6),
        scale
      })
    }
  }

  componentDidMount() {
    this.zoom()
    window.addEventListener('load', this.zoom)
    window.addEventListener('resize', this.zoom)
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.zoom)
    window.removeEventListener('resize', this.zoom)
  }

  render() {
    const {
      children,
      align,
      maxHeight,
      maxWidth,
      margin,
      ...rest
    } = this.props

    const { zoom, scale } = this.state

    return (
      <Outer {...rest}>
        <Inner align={align}>
          <Content
            innerRef={c => { this.contentRef = c }}
            maxHeight={maxHeight}
            maxWidth={maxWidth}
            margin={margin}
            scale={scale}
            zoom={zoom}
          >
            {children}
          </Content>
        </Inner>
      </Outer>
    )
  }
}

export default Slide
