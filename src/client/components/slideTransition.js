import React, { Component, createElement } from 'react'
import Animated from 'animated/lib/targets/react-dom'

import Container from './container'
import SlideContainer from './slideContainer'

const makeStyle = (element, value) => ({ element, value })
const findStyle = (styles, id) => styles.find(x => x.id === id)

class SlideTransition extends Component {
  state = {
    // Initial state should not animate
    styles: {
      [this.props.id]: makeStyle(this.props.element, new Animated.Value(0))
    }
  }

  transitionIn = ({ id, element }) => {
    const { styles } = this.state

    const value = styles[id] === undefined
      ? new Animated.Value(1)
      : styles[id].value

    const style = makeStyle(element, value)

    setTimeout(() => {
      Animated.spring(value, { toValue: 0 }).start()
    })

    this.setState(({ styles }) => ({
      styles: { ...styles, [id]: style }
    }))
  }

  transitionOut = id => {
    const { styles } = this.state
    const style = styles[id]

    if (style === undefined) {
      return
    }

    Animated.spring(style.value, { toValue: -1 }).start(({ finished }) => {
      if (!finished) {
        return
      }

      this.setState(({ styles }) => ({
        styles: { ...styles, [id]: undefined }
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
        {Object.keys(styles)
          .map(id => {
            if (styles[id] === undefined) {
              return undefined
            }

            const { element, value } = styles[id]

            return (
              <SlideContainer key={id} value={value}>
                {createElement(element, { value })}
              </SlideContainer>
            )
          })
          .filter(x => x !== undefined)}
      </Container>
    )
  }
}

export default SlideTransition
