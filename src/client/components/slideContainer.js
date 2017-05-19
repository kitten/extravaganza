import React, { Component, createElement } from 'react'
import styled, { withTheme } from 'styled-components'
import Animated from 'animated/lib/targets/react-dom'

const Slide = styled(Animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const assembleStyle = ({ value, theme }) => {
  const { transitions = [] } = theme
  const style = { transform: [] }

  if (transitions.includes('fade')) {
    style.opacity = Animated.add(
      Animated.multiply(
        Animated.multiply(value, value),
        new Animated.Value(-1)
      ),
      new Animated.Value(1)
    )
  }

  if (transitions.includes('slide')) {
    const translateX = value.interpolate({
      inputRange: [-1, 1],
      outputRange: ['-100%', '100%']
    })

    style.transform.push({ translateX })
  }

  if (transitions.includes('rotate')) {
    const rotateY = value.interpolate({
      inputRange: [-1, 1],
      outputRange: ['-90deg', '90deg']
    })

    style.transform.push({ rotateY })
  }

  return style
}

class SlideContainer extends Component {
  componentWillMount() {
    this.style = assembleStyle(this.props)
  }

  render() {
    const { style } = this
    const { element, value } = this.props

    return (
      <Slide style={style}>
        {createElement(element, { transition: value })}
      </Slide>
    )
  }
}

export default withTheme(SlideContainer)
