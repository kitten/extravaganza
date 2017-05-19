// Source: next.js
// https://github.com/zeit/next.js/blob/master/server/build/loaders/emit-file-loader.js

import loaderUtils from 'loader-utils'
import { transform } from 'babel-core'

const transpile = content =>
  transform(content, {
    babelrc: false,
    sourceMaps: false,
    plugins: [require.resolve('babel-plugin-transform-es2015-modules-commonjs')]
  }).code

module.exports = function emitFileLoader(content, sourceMap) {
  this.cacheable()

  const name = 'dist/[path][name].[ext]'
  const context = this.options.context

  const interpolatedName = loaderUtils.interpolateName(this, name, {
    context,
    content
  })

  let newContent = content
  if (interpolatedName.endsWith('.js')) {
    newContent = transpile(content)
  }

  // Emit file to separate dist/ folder and pass the input on unchanged
  this.emitFile(interpolatedName, newContent)
  this.callback(null, content, sourceMap)
}
