module.exports = function hotAcceptLoader (content, sourceMap) {
  this.cacheable()

  const newContent = `${content}
    (function (Component, route) {
      if (!module.hot) return Component
      module.hot.accept()
    })(module.exports.default || module.exports)
  `

  this.callback(null, newContent, sourceMap)
}
