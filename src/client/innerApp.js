import React, { Component } from 'react'
import { withTheme, injectGlobal } from 'styled-components'
import { Route, Redirect, Switch } from 'react-router-dom'

import Overview from './components/overview'
import PresenterView from './components/presenterView'
import SlideTransition from './components/slideTransition'
import parseId from './utils/parseId'

class InnerApp extends Component {
  componentWillMount() {
    const { theme } = this.props

    const googleFontQuery = `${theme.googleFont.name.replace(/ /g, '+')}:${theme.googleFont.weights.join(',')}`

    injectGlobal`
      @import url('https://fonts.googleapis.com/css?family=${googleFontQuery}');

      html, body {
        font-family: ${theme.googleFont.name}, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        background: ${theme.colors.background};
        color: ${theme.colors.primary};
        font-size: 50px;
      }
    `
  }

  parseId = matchedStr => {
    const { slides } = this.props
    return parseId(slides.length, matchedStr)
  }

  render() {
    const { slides } = this.props

    return (
      <Switch>
        <Route
          strict
          exact
          path="/overview"
          render={() => <Overview slides={slides} />}
        />

        <Route
          strict
          exact
          path="/presenter/:id"
          render={({ match }) => {
            const id = this.parseId(match.params.id)
            if (id === undefined) {
              return <Redirect to="/presenter/0" />
            }

            return <PresenterView id={id} slides={slides} />
          }}
        />

        <Route
          strict
          exact
          path="/:id"
          render={({ match }) => {
            const id = this.parseId(match.params.id)
            if (id === undefined) {
              return <Redirect to="/0" />
            }

            return <SlideTransition id={id} element={slides[id]} />
          }}
        />

        <Redirect to="/0" />
      </Switch>
    )
  }
}

export default withTheme(InnerApp)
