const ensureUnit = x => (
  typeof x === 'number' ?
    `${x}px` :
    (/^\d+$/.test(x) ? `${x}px` : x)
)

export default ensureUnit
