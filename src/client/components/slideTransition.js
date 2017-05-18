import React, { Component, createElement } from 'react'
import Animated from 'animated/lib/targets/react-dom'

import Container from './container'
import SlideContainer from './slideContainer'

const makeStyle = (id, element, value) => ({ id, element, value })
const findStyle = (styles, id) => styles.find(x => x.id === id)

class SlideTransition extends Component {
  state = {
    // Initial state should not animate
    styles: [
      makeStyle(this.props.id, this.props.children, new Animated.Value(0))
    ]
  }

  transitionIn = ({ id, children }) => {
    // Start value at `1`
    const value = new Animated.Value(1)
    const style = makeStyle(id, children, value)

    // Animate value to `0`
    setTimeout(() => {
      Animated.spring(value, { toValue: 0 }).start()
    })

    // Add style to state
    this.setState(({ styles }) => ({
      styles: styles.concat(style)
    }))
  }

  transitionOut = id => {
    const style = findStyle(this.state.styles, id)
    if (style === undefined) {
      return
    }

    // Animate to `-1` and remove style
    Animated.spring(style.value, { toValue: -1 }).start(() => {
      this.setState(({ styles }) => ({
        styles: styles.filter(x => x.id !== id)
      }))
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id === this.props.id) {
      return
    }

    this.transitionIn(nextProps)
    this.transitionOut(this.props.id)
  }

  render() {
    const { styles } = this.state

    return (
      <Container>
        {styles.map(({ id, element, value }) => (
          <SlideContainer key={id} value={value}>
            {createElement(element, { value })}
          </SlideContainer>
        ))}
      </Container>
    )
  }
}

export default SlideTransition
