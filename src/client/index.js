import './offline'

import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'

import App from './app'
import slideManager from './slideManager'

const node = document.getElementById('root')

slideManager.waitUntilReady().then(() => {
  render(
    <BrowserRouter>
      <App slideManager={slideManager} />
    </BrowserRouter>,
    node
  )
})
