import React, { Component } from 'react'
import InnerApp from './innerApp'

const prevSlideKeys = [37, 33]
const nextSlideKeys = [39, 34, 32]

class App extends Component {
  state = {
    slides: this.props.slideManager.getSlides()
  }

  handleKey = ({ keyCode }) => {
    if (nextSlideKeys.includes(keyCode)) {
      this.props.slideManager.gotoNext()
    } else if (prevSlideKeys.includes(keyCode)) {
      this.props.slideManager.gotoPrev()
    }
  }

  handleTouch = ({ touches }) => {
    if (touches.length === 1) {
      const { clientX } = touches[0]
      if (clientX >= window.innerWidth / 2) {
        this.props.slideManager.gotoNext()
      } else {
        this.props.slideManager.gotoPrev()
      }
    }
  }

  updateSlide = evt => {
    this.props.slideManager.updateState(evt)
  }

  componentDidMount() {
    this.unsubscribe = this.props.slideManager.subscribe(slides => {
      this.setState({ slides })
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

export default App
