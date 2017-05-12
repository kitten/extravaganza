import { join } from 'path'
import webpack from 'webpack'
import glob from 'glob-promise'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin'
import WriteFilePlugin from 'write-file-webpack-plugin'

import resolvePaths from '../utils/resolvePaths'
import SlidePlugin from './plugins/slidePlugin'

import {
  getContext,
  getBuildFolder,
  getTempFolder,
  getSlidesFolder
} from '../user/config'

const makeCompiler = async ({ production }) => {
  const entry = {
    'main.js': [
      !production && 'webpack-hot-middleware/client?overlay=false&reload=true&path=/_extravaganza/hmr',
      require.resolve('../client/index')
    ].filter(Boolean)
  }

  const slides = await glob('slides/**/*.js', { cwd: getContext() })
  for (const slide of slides) {
    if (entry[slide] === undefined) {
      entry[slide] = [ resolvePaths(getContext(), slide) ]
    }
  }

  const totalSlides = slides.length

  const config = {
    context: getContext(),
    devtool: production ? false : 'cheap-module-inline-source-map',
    entry,

    output: {
      path: getBuildFolder(production),
      filename: '[name]',
      chunkFilename: '[id]-[name].js',
      publicPath: '/_extravaganza/webpack/',
      strictModuleExceptionHandling: true
    },

    module: {
      // NOTE: The order here is very important (reverse order)
      // 1. Create lazy bundle-loaders for slides
      // 2. Compile entire app to dist/ folder for node.js
      // 3. Transpile all js-files to ES5
      // Please don't ask me how long it took to figure this out :'(

      rules: [
        {
          test: /\.js$/,
          include: [
            getSlidesFolder()
          ],
          use: [{
            loader: 'bundle-loader',
            options: {
              lazy: true,
              name: 'slide'
            }
          }]
        }, {
          test: /\.(js|json)$/,
          include: [
            getContext(),
            getSlidesFolder()
          ],
          exclude: [
            /node_modules/,
            getTempFolder()
          ],
          loader: require.resolve('./loaders/emitFileLoader'),
        }, {
          test: /\.js$/,
          exclude: [
            getTempFolder(),
            /node_modules/
          ],
          use: [{
            loader: 'babel-loader',
            options: {
              cacheDirectory: resolvePaths(getTempFolder(), 'babel-cache')
            }
          }]
        }, {
          test: /\.json$/,
          loader: 'json-loader'
        }
      ]
    },

    resolve: {
      extensions: ['.js', '.json']
    },

    plugins: [
      new webpack.LoaderOptionsPlugin({
        minimize: production
      }),

      new webpack.optimize.CommonsChunkPlugin({
        name: 'commons',
        filename: 'commons.js',
        minChunks: (module, count) => (
          production ?
            (count >= totalSlides * 0.5) :
            (module.context && module.context.indexOf('node_modules') >= 0)
        )
      }),

      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        filename: 'manifest.js'
      }),

      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development')
      }),

      new WriteFilePlugin({
        exitOnErrors: false,
        log: false,
        useHashIndex: false
      }),

      new SlidePlugin(),
      new CaseSensitivePathsPlugin()
    ].concat(production ? [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true,
          warnings: false
        },
        comments: false,
        sourceMap: false
      })
    ] : [
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new FriendlyErrorsPlugin()
    ]),

    stats: true
  }

  return webpack(config)
}

export default makeCompiler
