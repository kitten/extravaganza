import React, { Component } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'

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

class App extends Component {
  state = {
    slides: this.props.slideManager.getSlides()
  }

  componentDidMount() {
    this.unsubscribe = this.props.slideManager.subscribe(slides => {
      this.forceUpdate()
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    return <InnerApp slides={this.state.slides} />
  }
}

export default App
