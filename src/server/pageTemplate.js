import { resolve } from 'path'
import { readFileSync } from 'fs'

const sanitizeCSS = readFileSync(
  resolve(__dirname, '../../assets/sanitize.css'),
  { encoding: 'utf8' }
)

const injectScripts = names =>
  names
    .map(name => {
      const async = name.startsWith('chunk/') ? 'async' : ''
      return `<script ${async} type="text/javascript" src="/_extravaganza/${name}"></script>`.trim()
    })
    .join('\n')

const makePageTemplate = (html, css, scripts, slideNames) => `
  <html>
    <head>
      <meta httpequiv="X-UA-Compatible" content="IE=edge,chrome=1" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style type="text/css">${sanitizeCSS}</style>
      ${css}

      <title>Extravaganza Slides</title>
      <link rel="icon" type="image/png" href="/static/favicon.png" />
    </head>

    <body>
      <div id="root">${html}</div>

      <script type="text/javascript">
        window.__SLIDES__ = ${JSON.stringify(slideNames)}
      </script>

      ${injectScripts(scripts)}
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
