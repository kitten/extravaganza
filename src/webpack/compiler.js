import { join, relative, resolve } from 'path'
import webpack from 'webpack'
import glob from 'glob-promise'
import HappyPack from 'happypack'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin'
import WriteFilePlugin from 'write-file-webpack-plugin'
import PrecacheWebpackPlugin from 'sw-precache-webpack-plugin'
import rimraf from 'rimraf'
import mkdirp from 'mkdirp-promise'

import resolvePaths from '../utils/resolvePaths'
import SlidesPlugin from './plugins/slidesPlugin'
import WatchSlidesPlugin from './plugins/watchSlidesPlugin'
import CombineAssetsPlugin from './plugins/combineAssetsPlugin'
import findBabelConfig from './babel/findConfig'
import findSlides from './utils/findSlides'

import {
  getContext,
  getBuildFolder,
  getTempFolder,
  getSlidesFolder,
  getThemePath,
  getHappyPackCache
} from '../user/config'

const nodePathList = (process.env.NODE_PATH || '')
  .split(process.platform === 'win32' ? ';' : ':')
  .filter(Boolean)

const rm = dir => new Promise(resolve => rimraf(dir, resolve))

const makeCompiler = async ({ production }) => {
  const baseEntry = {
    'main.js': [
      !production && require.resolve('../client/hotMiddlewareClient'),
      !production && require.resolve('react-hot-loader/patch'),
      require.resolve('../client/index')
    ].filter(Boolean)
  }

  const makeEntry = async () => {
    const entry = Object.assign({}, baseEntry)
    const slides = await findSlides()

    slides.forEach(slide => {
      entry[slide] = [ resolvePaths(getContext(), slide) ]
    })

    return entry
  }

  let minChunks
  if (production) {
    const noSlides = (await findSlides()).length
    minChunks = (_, count) => count >= noSlides / 4
  } else {
    minChunks = module => module.context && module.context.includes('node_modules')
  }

  const babelOptions = {
    cacheDirectory: true,
    presets: []
  }

  const externalBabelConfig = findBabelConfig(getContext())
  if (externalBabelConfig) {
    console.log(`> Found external babel configuration`)
    const { options: { babelrc }} = externalBabelConfig
    babelOptions.babelrc = babelrc !== false
  } else {
    babelOptions.babelrc = false
  }

  if (!babelOptions.babelrc) {
    babelOptions.presets.push(require.resolve('./babel/preset'))
  }

  const config = {
    context: getContext(),
    devtool: production ? false : 'cheap-module-inline-source-map',
    entry: production ? await makeEntry() : makeEntry,

    output: {
      path: getBuildFolder(production),
      filename: '[name]',
      chunkFilename: 'chunk/[name].js',
      publicPath: '/_extravaganza/',
      strictModuleExceptionHandling: true
    },

    module: {
      rules: [
        {
          test: /\.json$/,
          exclude: [
            getTempFolder(),
            /node_modules/
          ],
          loader: require.resolve('json-loader')
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
          loader: require.resolve('./loaders/emitFileLoader')
        }, {
          test: /\.js$/,
          exclude: [
            getTempFolder(),
            /node_modules/
          ],
          use: [!production && {
            loader: require.resolve('react-hot-loader/webpack')
          }, {
            loader: require.resolve('happypack/loader'),
            query: { id: 'babel' }
          }].filter(Boolean)
        }
      ].filter(Boolean)
    },

    resolve: {
      alias: {
        'extravaganza/theme': getThemePath()
      },
      extensions: ['.js', '.json'],
      modules: [
        resolve(__dirname, '../../node_modules/'),
        'node_modules',
        ...nodePathList
      ]
    },

    plugins: [
      new HappyPack({
        id: 'babel',
        tempDir: getHappyPackCache(),
        loaders: [
          {
            path: require.resolve('babel-loader'),
            query: babelOptions
          }
        ],
        verbose: false
      }),

      new webpack.optimize.CommonsChunkPlugin({
        name: 'commons',
        filename: 'commons.js',
        minChunks
      }),

      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        filename: 'manifest.js'
      }),

      new webpack.DefinePlugin({
        '__SLIDES_FOLDER__': JSON.stringify(getSlidesFolder()),
        'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development')
      }),

      new WriteFilePlugin({
        test: /(\.hot-update){0}\.js(on)?$/,
        exitOnErrors: false,
        log: false,
        useHashIndex: false
      }),

      new CaseSensitivePathsPlugin(),
      new SlidesPlugin()
    ].concat(production ? [
      new PrecacheWebpackPlugin({
        filename: 'sw.js',
        minify: true,
        runtimeCaching: [
          {
            handler: 'fastest',
            urlPattern: /[.](png|jpg|gif|css|woff|woff2|ttf|otf)/
          },
          {
            handler: 'networkFirst',
            urlPattern: /^http.*/
          }
        ],
        logger: () => {}
      }),

      new CombineAssetsPlugin(['manifest.js', 'commons.js', 'main.js'], 'app.js'),

      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
        exclude: await findSlides(),
        sourceMap: false
      })
    ] : [
      new WatchSlidesPlugin(getSlidesFolder()),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new FriendlyErrorsPlugin()
    ]),

    stats: true
  }

  if (production) {
    config.resolve.alias.react = require.resolve('preact-compat/dist/preact-compat')
    config.resolve.alias['react-dom'] = require.resolve('preact-compat/dist/preact-compat')
  }

  await rm(getBuildFolder(production))
  await mkdirp(getHappyPackCache())

  return webpack(config)
}

export default makeCompiler
