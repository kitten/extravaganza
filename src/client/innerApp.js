import React from 'react'
import { ThemeProvider, injectGlobal } from 'styled-components'
import { Route, Redirect, Switch } from 'react-router-dom'

import SlideTransition from './components/slideTransition'
import Container from './components/container'
import SlideContainer from './components/slideContainer'
import theme from 'extravaganza/theme'

const atEnter = { opacity: 0 }
const atActive = { opacity: 1 }
const atLeave = { opacity: 0 }

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
    <Route render={({ location }) => (
      <SlideTransition
        pathname={location.pathname}
        atEnter={atEnter}
        atActive={atActive}
        atLeave={atLeave}
        Parent={Container}
        Child={SlideContainer}
      >
        <Switch key={location.key} location={location}>
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
    )} />
  </ThemeProvider>
)

export default InnerApp
