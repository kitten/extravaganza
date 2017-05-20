import React, { Component } from 'react'
import styled, { css } from 'styled-components'

import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-css-extras'
import 'prismjs/components/prism-sass'
import 'prismjs/components/prism-less'

import base, { baseFontSize } from './base'

const prism = (code, language = 'jsx') => highlight(code, languages[language])

const Highlight = styled.pre`
  font-family: Operator Mono, Monaco, Menlo, monospace;
  text-align: center;

  display: inline-block;
  white-space: pre-wrap;
  text-align: left;

  box-sizing: border-box;
  vertical-align: baseline;
  outline: none;
  text-shadow: none;
  -webkit-hyphens: none;
  -ms-hyphens: none;
  hyphens: none;
  word-wrap: normal;
  word-break: normal;
  text-align: left;
  word-spacing: normal;
  -moz-tab-size: 2;
  -o-tab-size: 2;
  tab-size: 2;

  ${p => p.theme.codeBlockTheme}
  ${base}
  ${baseFontSize(-1)}
`

class CodeBlock extends Component {
  html = prism(this.props.code, this.props.language)

  render() {
    return (
      <Highlight
        dangerouslySetInnerHTML={{ __html: this.html }}
        {...this.props}
        code={undefined}
        language={undefined}
      />
    )
  }
}

export default CodeBlock
