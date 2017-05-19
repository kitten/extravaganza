import moduleAlias from 'module-alias'
import alias from '../webpack/alias'

if (process.env.NODE_ENV === 'production') {
  for (const key in alias) {
    if (alias.hasOwnProperty(key)) {
      moduleAlias.addAlias(key, alias[key])
    }
  }
}
