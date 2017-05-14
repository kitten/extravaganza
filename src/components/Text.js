import React, { Component } from 'react'
import styled from 'styled-components'
import base from './base'

const Text = styled.span`
  line-height: ${p => p.lineHeight};
  ${base}
`

export default Text
