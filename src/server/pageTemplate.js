import { resolve } from 'path'
import { readFileSync } from 'fs'

const sanitizeCSS = readFileSync(
  resolve(__dirname, '../../assets/sanitize.css'),
  { encoding: 'utf8' }
)

const pageBucketScript = `window.__SLIDE_LOADERS__ = {};window.__REGISTER_SLIDE__ = function (routeName, loader) {window.__SLIDE_LOADERS__[routeName] = loader}`

const pageSlideScripts = slides => slides
  .map(slideRoute => `
    <script type="text/javascript" src="/_extravaganza/${slideRoute}"></script>
  `)
  .join('')

const makePageTemplate = (html, css, slides) => `
  <html>
    <head>
      <meta httpequiv="X-UA-Compatible" content="IE=edge,chrome=1" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style type="text/css">${sanitizeCSS}</style>
      ${css}

      <title>Extravaganza Slides</title>
    </head>

    <body>
      <div id="root">${html}</div>

      <script>${pageBucketScript}</script>
      ${pageSlideScripts(slides)}
    </body>
  </html>
`

export const makeErrorTemplate = html => `
  <html>
    <head>
      <meta httpequiv="X-UA-Compatible" content="IE=edge,chrome=1" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style type="text/css">${sanitizeCSS}</style>

      <title>Extravaganza Slides: Error</title>
    </head>

    <body>
      <div id="root">${html}</div>
    </body>
  </html>
`

export default makePageTemplate
