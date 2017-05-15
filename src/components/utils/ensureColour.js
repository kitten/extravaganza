const ensureColour = x =>
  /^\w+$/.test(x) ?
    (p => p.theme.colors[x] || x) :
    x

export default ensureColour
