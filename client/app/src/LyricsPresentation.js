import React from 'react'

class LyricsPresentation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      presentLine: 0,
      playing: false
    }
  }

  componentDidMount() {
    document.getElementById("line").style.visibility = "hidden"
  }

  render() {
    return (
      <div className="text-center box">
        <h1 style={{ fontWeight: "bold" }}>
          <span style={{ fontStyle: "italic" }}>{this.props.song.title}</span> (by {this.props.song.author})&nbsp;
          <button disabled={this.state.playing} onClick={() => { this.play() }} className="btn btn-primary">Play</button>
        </h1>
        <p id="line" style={{ fontSize: "10vw" }}>
          {this.props.song.lyrics[this.state.presentLine]}
        </p>
      </div>
    )
  }

  play() {
    if (this.state.playing === false) {
      document.getElementById("line").style.visibility = "visible"
      this.setState({
        playing: true,
        presentLine: 0
      }, () => {
        setTimeout(() => { this.play(); }, this.props.song.timeStamps[0])
      })
    } else {
      this.setState({ presentLine: this.state.presentLine + 1 }, () => {
        if (this.state.presentLine < this.props.song.lyrics.length) {
          setTimeout(() => { this.play(); }, this.props.song.timeStamps[this.state.presentLine])
        } else {
          this.setState({ playing: false }, () => {
            document.getElementById("line").style.visibility = "hidden"
          })
        }
      })
    }
  }
}

export default LyricsPresentation