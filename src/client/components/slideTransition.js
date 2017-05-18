import React, { Component, createElement } from 'react'
import Animated from 'animated/lib/targets/react-dom'

import Container from './container'
import SlideContainer from './slideContainer'

const makeStyle = (element, value) => ({ element, value })
const findStyle = (styles, id) => styles.find(x => x.id === id)
const springConfig = { friction: 10, tension: 35 }

class SlideTransition extends Component {
  state = {
    // Initial state should not animate
    styles: {
      [this.props.id]: makeStyle(this.props.element, new Animated.Value(0))
    }
  }

  transitionIn = (lastId, { id, element }) => {
    const { styles } = this.state

    const origin = id > lastId ? 1 : -1
    const value = styles[id] === undefined
      ? new Animated.Value(origin)
      : styles[id].value

    const style = makeStyle(element, value)

    setTimeout(() => {
      Animated.spring(value, { ...springConfig, toValue: 0 }).start()
    })

    this.setState(({ styles }) => ({
      styles: { ...styles, [id]: style }
    }))
  }

  transitionOut = (id, nextId) => {
    const { styles } = this.state
    const style = styles[id]

    if (style === undefined) {
      return
    }

    const toValue = id < nextId ? -1 : 1

    Animated.spring(style.value, {
      ...springConfig,
      toValue
    }).start(({ finished }) => {
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

    this.transitionIn(this.props.id, nextProps)
    this.transitionOut(this.props.id, nextProps.id)
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
