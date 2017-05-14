import React, { Component } from 'react'
import styled from 'styled-components'
import base from './base'

const Container = styled.div`
  display: block;
  width: 100%;
  height: ${p => p.height}px;
`

const Text = styled.span`
  display: block;
  font-size: 16px;
  margin: 0;
  padding: 0;
  line-height: ${p => p.lineHeight};
  transform: scale(${p => p.scale});
  transform-origin: center top;
  ${base}
`

class TextFit extends Component {
  state = {
    scale: 1,
    height: 16
  }

  resize = () => {
    const { textRef, containerRef } = this

    textRef.style.display = 'inline-block'
    const scale = containerRef.offsetWidth / textRef.offsetWidth
    const height = (textRef.offsetHeight * scale) || 0
    textRef.style.display = 'block'

    this.setState({
      scale,
      height
    })
  }

  componentDidMount() {
    this.resize()
    window.addEventListener('load', this.resize)
    window.addEventListener('resize', this.resize)
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.resize)
    window.removeEventListene('resize', this.resize)
  }

  render() {
    const { children, className, style, ...props } = this.props
    const { height, scale } = this.state

    return (
      <Container
        className={className}
        style={style}
        innerRef={c => { this.containerRef = c }}
        height={height}
      >
        <Text
          innerRef={t => { this.textRef = t }}
          scale={scale}
          {...props}
        >
          {children}
        </Text>
      </Container>
    )
  }
}

export default TextFit
