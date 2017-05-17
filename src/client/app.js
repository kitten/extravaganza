import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import InnerApp from './innerApp'

const prevSlideKeys = [37, 33]
const nextSlideKeys = [39, 34, 32]

class App extends Component {
  state = {
    slides: this.props.slideManager.getSlides()
  }

  handleKey = ({ keyCode }) => {
    const { push } = this.props.history

    if (nextSlideKeys.includes(keyCode)) {
      this.props.slideManager.gotoNext(push)
    } else if (prevSlideKeys.includes(keyCode)) {
      this.props.slideManager.gotoPrev(push)
    }
  }

  handleTouch = ({ touches }) => {
    const { push } = this.props.history

    if (touches.length === 1) {
      const { clientX } = touches[0]
      if (clientX >= window.innerWidth / 2) {
        this.props.slideManager.gotoNext(push)
      } else {
        this.props.slideManager.gotoPrev(push)
      }
    }
  }

  updateSlide = evt => {
    const push = this.props.history.push
    this.props.slideManager.updateState(evt, push)
  }

  componentDidMount() {
    this.unsubscribe = this.props.slideManager.subscribe(slides => {
      this.forceUpdate()
    })

    window.addEventListener('keydown', this.handleKey)
    window.addEventListener('touchstart', this.handleTouch)
    window.addEventListener('storage', this.updateSlide)
  }

  componentWillUnmount() {
    this.unsubscribe()

    window.removeEventListener('keydown', this.handleKey)
    window.removeEventListener('touchstart', this.handleTouch)
    window.removeEventListener('storage', this.updateSlide)
  }

  render() {
    return <InnerApp slides={this.state.slides} />
  }
}

export default withRouter(App)
