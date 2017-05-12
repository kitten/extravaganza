import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import App from './app'
import makeLoadables from './makeLoadables'

const app = (
  <BrowserRouter>
    <App slides={makeLoadables(window.__SLIDE_LOADERS__)} />
  </BrowserRouter>
)

render(app, document.getElementById('root'))
