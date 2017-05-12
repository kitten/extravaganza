// Source: next.js
// https://github.com/zeit/next.js/blob/master/server/build/plugins/pages-plugin.js

const wrapCode = (routeName, content) => (`
window.__REGISTER_SLIDE__('${routeName}', function() {
  var comp = ${content};
  return comp;
})
`).trim()

class SlidePlugin {
  apply (compiler) {
    const isBundledSlide = /^slides[/\\].*\.js$/
    const matchRouteName = /^slides[/\\](.*)\.js$/

    compiler.plugin('after-compile', (compilation, callback) => {
      const slides = Object
        .keys(compilation.namedChunks)
        .map(key => compilation.namedChunks[key])
        .filter(chunk => isBundledSlide.test(chunk.name))
        .forEach((chunk) => {
          const slide = compilation.assets[chunk.name]
          const slideName = matchRouteName.exec(chunk.name)[1]
          let routeName = `/${slideName.replace(/[/\\]?index$/, '')}`

          // We need to convert \ into / when we are in windows
          // to get the proper route name
          if (/^win/.test(process.platform)) {
            routeName = routeName.replace(/\\/g, '/')
          }

          const content = slide.source()
          const newContent = wrapCode(routeName, content)

          // Replace the exisiting chunk with the new content
          compilation.assets[chunk.name] = {
            source: () => newContent,
            size: () => newContent.length
          }
        })

      callback()
    })
  }
}

export default SlidePlugin
