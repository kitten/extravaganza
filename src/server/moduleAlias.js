import moduleAlias from 'module-alias'
import { getThemePath } from '../user/config'

moduleAlias.addAlias('extravaganza/theme', getThemePath())

if (process.env.NODE_ENV === 'production') {
  moduleAlias.addAlias('react', 'preact-compat')
  moduleAlias.addAlias('react-dom', 'preact-compat')
}
