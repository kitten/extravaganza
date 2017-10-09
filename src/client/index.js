import './offline'

import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Router } from 'react-router-dom'
import { injectGlobal, ThemeProvider } from 'styled-components'

import App from './app'
import history from './history'
import slideManager from './slideManager'
import theme from 'extravaganza/theme'

const node = document.getElementById('root')

slideManager.waitUntilReady().then(() => {
  render(
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <App slideManager={slideManager} />
      </Router>
    </ThemeProvider>,
    node
  )
})
