import React, { cloneElement } from 'react'
import TransitionMotion from 'react-motion/lib/TransitionMotion'
import { Route } from 'react-router-dom'
import spring from 'react-motion/lib/spring'

const gentle = { stiffness: 120, damping: 14 }
const ensureSpring = styles => Object
  .keys(styles)
  .reduce((acc, key) => {
    const value = styles[key]
    acc[key] = typeof value === 'number' ? spring(value, gentle) : value
    return acc
  }, {})

const SlideTransition = ({
  Parent,
  Child,
  children,
  atEnter,
  atActive,
  atLeave
}) => (
  <Route render={({ location: { pathname }}) => (
    <TransitionMotion
      styles={children ? [{
        key: pathname,
        data: children,
        style: ensureSpring(atActive)
      }] : []}
      willEnter={() => atEnter}
      willLeave={() => ensureSpring(atLeave)}
    >
      {
        styles => (
          <Parent>
            {
              styles.map(({ key, data, style }) => (
                <Child key={key} style={style}>
                  {data}
                </Child>
              ))
            }
          </Parent>
        )
      }
    </TransitionMotion>
  )}/>
)

export default SlideTransition
