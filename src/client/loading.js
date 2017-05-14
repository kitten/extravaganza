import React from 'react'
import styled, { keyframes } from 'styled-components'
import Redbox from 'redbox-react'

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`

const Spinner = styled.div`
  display: block;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -15px;
  margin-top: -15px;

  animation: ${spin} 0.75s linear infinite;
  width: 30px;
  height: 30px;
  border: 8px solid ${p => p.theme.colors.foreground};
  border-right-color: transparent;
  border-radius: 50%;
`

const Loading = ({ isLoading, error, pastDelay }) => {
  if (isLoading) {
    return pastDelay ? <Spinner /> : null
  } else if (error) {
    return <Redbox error={error} />
  }

  return null
}

export default Loading
