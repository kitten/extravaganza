import React, { Component, createElement } from 'react'
import styled from 'styled-components'
import Animated from 'animated/lib/targets/react-dom'

class SlideContainer extends Component {
  opacity = Animated.add(
    Animated.multiply(
      Animated.multiply(this.props.value, this.props.value),
      new Animated.Value(-1)
    ),
    new Animated.Value(1)
  )

  translateX = this.props.value.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-100%', '100%']
  })

  render() {
    const { translateX, opacity } = this
    const { element, className, children } = this.props
    const style = {
      transform: [{ translateX }],
      opacity
    }

    return (
      <Animated.div className={className} style={style}>
        {createElement(element, { transition: opacity })}
      </Animated.div>
    )
  }
}

const StyledSlideContainer = styled(SlideContainer)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

export default StyledSlideContainer
