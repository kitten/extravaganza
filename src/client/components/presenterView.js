import React, { Component, createElement } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #1e2526;

  display: flex;
  flex-direction: row;
  align-items: center;
`

const Column = styled.div`
  display: block;
  padding: 20px 0 20px 0;
`

const Notes = styled.pre`
  background: #fff;
  color: #000;
  font-size: 18px;
  line-height: 1.5;

  box-shadow: 0 0 24px rgba(0, 0, 0, 0.22), 0 24px 24px rgba(0, 0, 0, 0.3);
  border-radius: 3px;

  margin: 20px;
  padding: 20px;
  width: 100%;
`

const SlideContainer = styled.div`
  position: relative;

  background: ${p => p.theme.colors.background};
  color: ${p => p.theme.colors.primary};

  box-shadow: 0 0 24px rgba(0, 0, 0, 0.22), 0 24px 24px rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  overflow: hidden;

  width: ${p => (p.small ? '71.1vh' : '88.9vh')};
  height: ${p => (p.small ? '40vh' : '50vh')};
  margin: 20px;
`

const TheEnd = styled.div`
  background: #000;
  color: #fff;

  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`

class PresenterView extends Component {
  state = {
    notes: null
  }

  loadNotes = loadable => {
    if (loadable.notes) {
      return this.setState({ notes: loadable.notes })
    }

    this.setState({ notes: null })

    if (loadable.loader) {
      loadable.loader().then(slide => {
        const { notes } = slide.default || {}

        if (notes) {
          this.setState({ notes })
        }
      })
    }
  }

  componentDidMount() {
    const { id, slides } = this.props
    this.loadNotes(slides[id])
  }

  componentWillReceiveProps({ id, slides }) {
    this.loadNotes(slides[id])
  }

  render() {
    const { id, slides } = this.props
    const { notes } = this.state

    return (
      <Wrapper>
        <Column>
          <SlideContainer>
            {createElement(slides[id])}
          </SlideContainer>

          <SlideContainer small>
            {slides[id + 1] !== undefined
              ? createElement(slides[id + 1])
              : <TheEnd>Fin.</TheEnd>}
          </SlideContainer>
        </Column>

        <Column>
          {notes &&
            <Notes>
              {typeof notes === 'string' ? notes.trim() : notes}
            </Notes>}
        </Column>
      </Wrapper>
    )
  }
}

export default PresenterView
