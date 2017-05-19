import prismLight from './prism/light'
import prismDark from './prism/dark'

module.exports = {
  googleFont: {
    name: 'Montserrat',
    weights: [400, 600]
  },
  colors: {
    background: '#FCF8F3',
    primary: '#DB7093',
    secondary: '#F3B661'
  },
  codeBlockTheme: prismLight,
  playgroundTheme: prismDark,
  transitions: ['fade']
}
