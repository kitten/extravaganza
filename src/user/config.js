import { join } from 'path'
import resolvePaths from '../utils/resolvePaths'

let _config

export const getConfig = () => {
  if (_config !== undefined) {
    return _config
  }

  try {
    _config = require(join(process.cwd(), 'slides.config.js'))
    console.log('> Found user "slides.config.js" file')
  } catch(err) {
    _config = {}
  }

  return _config
}

export const getContext = () => (
  getConfig().context || process.cwd()
)

export const getTempFolder = () => resolvePaths(
  getContext(),
  '.extravaganza/'
)

export const getBuildFolder = production => !production ?
  getTempFolder() :
  resolvePaths(
    getContext(),
    getConfig().distDir || 'build/'
  )

export const getSlidesFolder = () => resolvePaths(
  getContext(),
  'slides/'
)
