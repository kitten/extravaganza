const aliases = {
  react: require.resolve('preact-compat/dist/preact-compat'),
  'react-dom/lib/CSSPropertyOperations': require.resolve(
    'react-dom/lib/CSSPropertyOperations'
  ),
  'react-dom/server': require.resolve('preact-compat/server'),
  'react-dom': require.resolve('preact-compat/dist/preact-compat')
}

export default aliases
