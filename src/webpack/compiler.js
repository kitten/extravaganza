import { join, relative } from 'path'
import webpack from 'webpack'
import glob from 'glob-promise'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin'
import WriteFilePlugin from 'write-file-webpack-plugin'
import sort from 'alphanum-sort'

import resolvePaths from '../utils/resolvePaths'
import SlidePlugin from './plugins/slidePlugin'
import WatchSlidePlugin from './plugins/watchSlidePlugin'

import {
  getContext,
  getBuildFolder,
  getTempFolder,
  getSlidesFolder
} from '../user/config'

const makeCompiler = async ({ production }) => {
  const makeEntry = async () => {
    const entry = {
      'main.js': [
        !production && require.resolve('../client/hotMiddlewareClient'),
        !production && 'react-hot-loader/patch',
        require.resolve('../client/index')
      ].filter(Boolean)
    }

    const slides = await glob('slides/**/*.js', { cwd: getContext() })

    for (const slide of sort(slides)) {
      if (entry[slide] === undefined) {
        entry[slide] = [ `./${slide}` ]
      }
    }

    return entry
  }

  let totalSlides
  if (production) {
    const _slides = await glob('slides/**/*.js', { cwd: getContext() })
    totalSlides = _slides.length
  }

  const config = {
    context: getContext(),
    devtool: production ? false : 'cheap-module-inline-source-map',
    entry: makeEntry,

    output: {
      path: getBuildFolder(production),
      filename: '[name]',
      chunkFilename: '[id]-slide.js',
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
              name: '[name]'
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
          use: [{
            loader: require.resolve('./loaders/emitFileLoader')
          }, !production && {
            loader: require.resolve('./loaders/hotAcceptLoader')
          }].filter(Boolean)
        }, {
          test: /\.js$/,
          exclude: [
            getTempFolder(),
            /node_modules/
          ],
          use: [!production && {
            loader: 'react-hot-loader/webpack'
          }, {
            loader: 'babel-loader',
            options: {
              cacheDirectory: resolvePaths(getTempFolder(), 'babel-cache')
            }
          }].filter(Boolean)
        }, {
          test: /\.json$/,
          loader: 'json-loader'
        }
      ].filter(Boolean)
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
        '__CONTEXT__': JSON.stringify(
          relative(
            require.resolve('../client/index'),
            getSlidesFolder()
          )
        ),
        'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development')
      }),

      new WriteFilePlugin({
        exitOnErrors: false,
        log: false,
        useHashIndex: false
      }),

      new SlidePlugin(production),
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
      new WatchSlidePlugin(getSlidesFolder()),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new FriendlyErrorsPlugin()
    ]),

    stats: true
  }

  if (production) {
    config.resolve.alias = {
      'react': 'preact-compat/dist/preact-compat',
      'react-dom': 'preact-compat/dist/preact-compat'
    }
  }

  return webpack(config)
}

export default makeCompiler
