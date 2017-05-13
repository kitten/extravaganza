import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import Container from './components/container'

export const InnerApp = ({ slides }) => (
  <Container>
    {
      slides.map(({ component, routeName }, index) => (
        <Route
          key={routeName}
          path={`/${index}`}
          component={component}
        />
      ))
    }
  </Container>
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
