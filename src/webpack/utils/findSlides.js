import { relative, join } from 'path'
import glob from 'glob-promise'

import {
  getContext,
  getSlidesFolder
} from '../../user/config'

const relativeSlidesFolder = relative(getContext(), getSlidesFolder())
const findSlides = () => glob(
  join(relativeSlidesFolder, '**/*.js'),
  { cwd: getContext() }
)

export default findSlides
