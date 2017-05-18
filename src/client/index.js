import './offline'

import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Router } from 'react-router-dom'

import App from './app'
import history from './history'
import slideManager from './slideManager'

const node = document.getElementById('root')

slideManager.waitUntilReady().then(() => {
  render(
    <Router history={history}>
      <App slideManager={slideManager} />
    </Router>,
    node
  )
})
