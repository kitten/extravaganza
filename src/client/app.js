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
  componentWillMount() {
    const { slideManager } = this.props

    this.unsubscribe = slideManager.subscribe(slides => {
      this.setState({ slides })
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
