import React, { Component } from 'react'
import styled from 'styled-components'
import Animated from 'animated/lib/targets/react-dom'

class SlideContainer extends Component {
  translateX = this.props.value.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-100%', '100%']
  })

  render() {
    const { translateX } = this
    const { className, children } = this.props
    const style = { transform: [{ translateX }] }

    return (
      <Animated.div className={className} style={style}>
        {children}
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
