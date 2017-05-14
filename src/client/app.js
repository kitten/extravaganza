import React, { Component } from 'react'
import { Route, Redirect, Switch, withRouter } from 'react-router-dom'

import SlideTransition from './components/slideTransition'
import Container from './components/container'
import SlideContainer from './components/slideContainer'

const atEnter = { opacity: 0 }
const atActive = { opacity: 1 }
const atLeave = { opacity: 0 }

export const InnerApp = ({ slides }) => (
  <SlideTransition
    atEnter={atEnter}
    atActive={atActive}
    atLeave={atLeave}
    Parent={Container}
    Child={SlideContainer}
  >
    <Switch>
      {
        slides.map(({ component, routeName }, index) => (
          <Route
            key={routeName}
            path={`/${index}`}
            component={component}
          />
        ))
      }

      <Redirect to="/0" />
    </Switch>
  </SlideTransition>
)

const prevSlideKeys = [37, 33]
const nextSlideKeys = [39, 34, 32]

class App extends Component {
  state = {
    slides: this.props.slideManager.getSlides()
  }

  handleKey = ({ keyCode }) => {
    const push = this.props.history.push

    let index
    if (nextSlideKeys.includes(keyCode)) {
      index = this.props.slideManager.gotoNext(push)
    } else if (prevSlideKeys.includes(keyCode)) {
      index = this.props.slideManager.gotoPrev(push)
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.slideManager.subscribe(slides => {
      this.forceUpdate()
    })

    window.addEventListener('keydown', this.handleKey)
  }

  componentWillUnmount() {
    this.unsubscribe()
    window.removeEventListener('keydown', this.handleKey)
  }

  render() {
    return <InnerApp slides={this.state.slides} />
  }
}

export default withRouter(App)
