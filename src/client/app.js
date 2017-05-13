import React, { Component } from 'react'
import { RouteTransition } from 'react-router-transition'
import { Route, Redirect, Switch } from 'react-router-dom'

import Container from './components/container'

export const InnerApp = ({ slides }) => (
  <Container>
    <Route render={({ location }) => (
      <RouteTransition
        pathname={location.pathname}
        atEnter={{ opacity: 0 }}
        atActive={{ opacity: 1 }}
        atLeave={{ opacity: 0 }}
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
      </RouteTransition>
    )}/>
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
