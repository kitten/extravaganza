import React, { Component } from 'react'
import { Route } from 'react-router-dom'

const App = ({ slides }) => (
  <div>
    {
      slides.map(({ component, routeName, index }) => (
        <Route
          key={routeName}
          path={`/${index}`}
          component={component}
        />
      ))
    }
  </div>
)

export default App
