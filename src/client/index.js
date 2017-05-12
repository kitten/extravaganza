import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import App from './app'
import makeLoadables from './makeLoadables'

const node = document.getElementById('root')

makeLoadables(window.__SLIDE_LOADERS__)
  .then(loadables => {
    render((
      <BrowserRouter>
        <App slides={loadables} />
      </BrowserRouter>
    ), node)
  })
