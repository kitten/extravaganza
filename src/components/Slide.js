import styled from 'styled-components'

const Slide = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;
  text-align: center;

  @media (orientation: landscape) {
    margin-left: 12.5%;
    height: 100%;
    width: 75%;
  }

  @media (orientation: portrait) {
    margin-top: 12.5%;
    height: 75%;
    width: 100%;
  }
`

export default Slide
