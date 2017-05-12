import React from 'react'

const Loading = ({ isLoading, error, pastDelay }) => {
  if (isLoading) {
    return pastDelay ? <div>Loading...</div> : null // Don't flash "Loading..." when we don't need to.
  } else if (error) {
    return <div>Error! Component failed to load: <br />{error}</div>
  } else {
    return null
  }
}

export default Loading
