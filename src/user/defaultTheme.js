import prismLight from './prism/light'
import prismDark from './prism/dark'

module.exports = {
  slide: {
    aspectRatio: 4 / 3,
    fontRatio: 'perfectFourth',
    padding: 50
  },
  font: {
    googleFont: true,
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
  transitions: ['fade'],
  components: {}
}
