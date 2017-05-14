import moduleAlias from 'module-alias'

if (process.env.NODE_ENV === 'production') {
  moduleAlias.addAlias('react', 'preact-compat')
  moduleAlias.addAlias('react-dom', 'preact-compat')
}
