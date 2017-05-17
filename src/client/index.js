import './offline'

import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'

import { slideNames, slideLoaders } from './utils/slideLoaders'
import App from './app'
import SlideManager from './slideManager'

const node = document.getElementById('root')
const mount = slideManager => render((
  <BrowserRouter>
    <App slideManager={slideManager} />
  </BrowserRouter>
), node)

SlideManager
  .init(slideLoaders, slideNames)
  .then(mount)
