// Source: next.js
// https://github.com/zeit/next.js/blob/master/server/build/loaders/emit-file-loader.js

import loaderUtils from 'loader-utils'

module.exports = function emitFileLoader (content, sourceMap) {
  this.cacheable()

  const name = 'dist/[path][name].[ext]'
  const context = this.options.context

  const interpolatedName = loaderUtils.interpolateName(this, name, {
    context,
    content
  })

  // Emit file to separate dist/ folder and pass the input on unchanged
  this.emitFile(interpolatedName, content, sourceMap)
  this.callback(null, content, sourceMap)
}
