import { relative, join } from 'path'

import { getConfig, getContext, getBuildFolder, getThemePath } from './config'

const distFolder = join(getBuildFolder(), 'dist/')

export const getTheme = () => {
  const { themePath } = getConfig()
  if (!themePath) {
    return require('./defaultTheme')
  }

  const themeRelativePath = join(
    distFolder,
    relative(getContext(), getThemePath())
  )

  const theme = require(themeRelativePath)

  return theme.__esModule ? theme.default : theme
}
