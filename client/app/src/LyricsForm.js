import React from 'react'
import { Link } from 'react-router-dom'

class LyricsForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 1,
      presentLine: 0,
      startTime: null,
      playAllowed: false,
      playing: false,
      title: null,
      author: null,
      lyrics: null,
      timeStamps: null
    }
  }
  render() {
    const firstStep = (
      <div>
        <div className="progress">
          <div className="progress-bar" role="progressbar" style={{ width: "33%" }}></div>
        </div>
        <div>
          <div className="box">
            <h1>Let's add a new song...</h1>
            <p>Just copy and paste the raw text of the song lyrics in the field <b>Lyrics</b>. We will handle everything...</p>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">Title</span>
              </div>
              <input type="text" className="form-control" id="title" />
            </div>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">Author</span>
              </div>
              <input type="text" className="form-control" id="author" />
            </div>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">Lyrics</span>
              </div>
              <textarea className="form-control" id="lyrics" />
            </div>
            <button onClick={() => this.processData()} className="btn btn-primary" >Add</button>
          </div>
        </div>
      </div>
    )
    const secondStep = (
      <div>
        <div className="progress">
          <div className="progress-bar" role="progressbar" style={{ width: "66%" }}></div>
        </div>
        <div>
          <div className="box">
            <h1>It's time to sync everything.</h1>
            <p>The lyrics have been splitted into small pieces of text which will be shown in each slide. Start playing your song and click the lyrics at the same time. Keep clicking so that a new line gets highlighted (the line which your are listening to at the moment). Click <b>Play</b> when recording has finished.</p>
            <div className="text-center" style={{ fontStyle: "italic" }} onClick={() => this.record()} id="lyrics">
              {this.getLyrics()}
            </div>
            <button disabled={!this.state.playAllowed} onClick={() => { this.setState({ step: 3 }) }} className="btn btn-primary">Play</button>
          </div>
        </div>
      </div>
    )
    const thirdStep = (
      <div>
        <div className="progress">
          <div className="progress-bar" role="progressbar" style={{ width: "100%" }}></div>
        </div>
        <div>
          <div className="box">
            <h1>Test it!</h1>
            <p>Click the lyrics and play the music at the same time to test the result. Then, click <b>Done</b>.</p>
            <div className="text-center" onClick={() => this.play()} id="lyrics">
              {this.getLyrics()}
            </div>
            <Link to="/dashboard">
              <button disabled={!this.state.doneAllowed} onClick={() => {
                this.props.onAddSong({
                  lyrics: this.state.lyrics,
                  author: this.state.author,
                  title: this.state.title,
                  timeStamps: this.state.timeStamps
                })
              }} className="btn btn-primary">Done</button>
            </Link>
          </div>
        </div>
      </div>
    )

    switch (this.state.step) {
      case 1: return firstStep;
      case 2: return secondStep;
      case 3: return thirdStep;
      default: ;
    }
  }

  processData() {
    var words = document.getElementById("lyrics").value.split(" ")
    var lines = []
    for (var i = 0; i < words.length; i = i + 10) {
      lines.push(words.slice(i, i + 10).join(" "))
    }
    this.setState({
      author: document.getElementById("author").value,
      title: document.getElementById("title").value,
      lyrics: lines,
      step: 2
    })
  }

  getLyrics() {
    if (this.state.lyrics) {
      let pieces = []
      pieces.push(
        <h3 key="titleandauthor" style={{ fontWeight: "bold" }}>
          <span style={{ fontStyle: "italic" }}>{this.state.title}</span> (by {this.state.author})
        </h3>
      )
      pieces.push(this.state.lyrics.map(function (piece, index) {
        return <p key={index} id={"line" + index.toString()}>{piece}</p>
      }))
      return pieces
    }
  }

  highlightLine(line) {
    document.getElementById("line" + line.toString()).style.fontWeight = "bold"
    if (line === 0) {
      document.getElementById("line" + (this.state.lyrics.length - 1).toString()).style.fontWeight = ""
    }
    if (line > 0) {
      document.getElementById("line" + (line - 1).toString()).style.fontWeight = ""
    }
  }

  record() {
    if (!this.state.startTime) {
      this.setState({
        presentLine: 0,
        playAllowed: false,
        startTime: Date.now(),
        timeStamps: new Array(this.state.lyrics.length)
      })
      document.getElementById("lyrics").style.color = "red"
      this.setState({ presentLine: 0 }, () => {
        this.highlightLine(0)
      })
    } else {
      let timeStampsTemp = this.state.timeStamps
      timeStampsTemp[this.state.presentLine] = Date.now()
      this.setState({
        timeStamps: timeStampsTemp,
        presentLine: this.state.presentLine + 1
      }, () => {
        if (this.state.presentLine < this.state.lyrics.length) {
          this.highlightLine(this.state.presentLine)
        } else {
          timeStampsTemp = this.state.timeStamps.map((timeStamp, index) => {
            if (index === 0) {
              return (timeStamp - this.state.startTime)
            }
            return (timeStamp - this.state.timeStamps[index - 1])
          })
          this.setState({
            playAllowed: true,
            startTime: null,
            timeStamps: timeStampsTemp
          }, () => {
            document.getElementById("lyrics").style.color = ""
          })
        }

      })
    }
  }

  play() {
    if (this.state.playing === false) {
      document.getElementById("lyrics").style.color = "blue"
      this.setState({
        playing: true,
        doneAllowed: false,
        presentLine: 0
      }, () => {
        this.highlightLine(0)
        setTimeout(() => { this.play(); }, this.state.timeStamps[0])
      })
    } else {
      this.setState({ presentLine: this.state.presentLine + 1 }, () => {
        if (this.state.presentLine < this.state.lyrics.length) {
          this.highlightLine(this.state.presentLine)
          setTimeout(() => { this.play(); }, this.state.timeStamps[this.state.presentLine])
        } else {
          this.setState({
            playing: false,
            doneAllowed: true
          }, () => {
            document.getElementById("lyrics").style.color = ""
          })
        }
      })
    }
  }
}

export default LyricsForm