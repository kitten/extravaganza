import React, { Component } from 'react'
import { Route } from 'react-router-dom'

const App = ({ slides }) => (
  <div>
    {
      slides.map(({ component, routeName }, index) => (
        <Route
          key={routeName}
          path={`/${index}`}
          component={component}
        />
      ))
    }
  </div>
)

export class SlideProvider extends Component {
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
    const { slides } = this.state
    return <App slides={slides} />
  }
}

export default App
