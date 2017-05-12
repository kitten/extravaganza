import { resolve, isAbsolute } from 'path'

const resolvePaths = (baseDir, dir) => {
  if (isAbsolute(dir)) {
    return dir
  }

  return resolve(baseDir, dir)
}

export default resolvePaths
