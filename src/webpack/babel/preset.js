module.exports = {
  presets: [
    [require.resolve('babel-preset-env'), {
      loose: true
    }],
    require.resolve('babel-preset-react')
  ],
  plugins: [
    require.resolve('babel-plugin-transform-object-rest-spread'),
    require.resolve('babel-plugin-transform-class-properties'),
    require.resolve('babel-plugin-transform-runtime')
  ]
}
