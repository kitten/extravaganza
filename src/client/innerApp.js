import React from 'react'
import { ThemeProvider, injectGlobal } from 'styled-components'
import { Route, Redirect, Switch } from 'react-router-dom'

import theme from 'extravaganza/theme'
import SlideTransition from './components/slideTransition'

const googleFontQuery = `${theme.googleFont.name}:${theme.googleFont.weights.join(',')}`

injectGlobal`
  @import url('https://fonts.googleapis.com/css?family=${googleFontQuery}');

  html, body {
    font-family: ${theme.googleFont.name}, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    background: ${theme.colors.background};
    color: ${theme.colors.primary};
    font-size: 1.8em;
    overflow: hidden;
  }
`

export const InnerApp = ({ slides }) => (
  <ThemeProvider theme={theme}>
    <Switch>
      <Route
        strict
        exact
        path="/:id"
        render={({ match }) => {
          const id = parseInt(match.params.id, 10)
          if (id < 0 || id >= slides.length || id !== id) {
            return <Redirect to="/0" />
          }

          return <SlideTransition id={id} element={slides[id].component} />
        }}
      />

      <Redirect to="/0" />
    </Switch>
  </ThemeProvider>
)

export default InnerApp
