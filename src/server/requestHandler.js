import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { ThemeProvider, ServerStyleSheet } from 'styled-components'
import RedBox from 'redbox-react'

import InnerApp from '../client/innerApp'
import makePageTemplate, { makeErrorTemplate } from './pageTemplate'
import { getTheme } from '../user/server'
import { getActiveState } from '../client/utils/currentSlide'

const prodAssets = ['app.js']
const devAssets = ['manifest.js', 'commons.js', 'main.js']

const requestHandler = (req, res, { build, production }) => {
  const theme = getTheme()
  const sheet = new ServerStyleSheet()

  const slideNames = build.getSlideNames()
  const slides = build.getSlides()
  const slideAssets = build.getSlideAssets()

  let assets = production ? prodAssets : devAssets

  try {
    const { id = -1, mode } = getActiveState(req.path) || {}
    if (id >= 0 && id < slides.length) {
      const activeSlideAssets = [slideAssets[id]]

      if (mode === 'presenter' && id + 1 < slides.length) {
        activeSlideAssets.push(slideAssets[id + 1])
      }

      assets = assets.concat(activeSlideAssets)
    } else if (mode === 'overview') {
      assets = assets.concat(slideAssets)
    }

    const app = renderToString(
      sheet.collectStyles(
        <ThemeProvider theme={theme}>
          <StaticRouter location={req.url} context={{}}>
            <InnerApp slides={slides} />
          </StaticRouter>
        </ThemeProvider>
      )
    )

    const css = sheet.getStyleTags()
    const html = makePageTemplate(app, css, assets, slideNames)

    res.status(200).send(html)
  } catch (err) {
    console.error(err)

    const app = renderToString(<RedBox error={err} />)
    const html = makeErrorTemplate(app)

    res.status(500).send(html)
  }
}

export default requestHandler
