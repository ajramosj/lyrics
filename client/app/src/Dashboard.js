import React from 'react'
import { Link } from 'react-router-dom'

class Dashboard extends React.Component {
  render() {
    return (
      <div className="text-center box">
        <h1>Hi <b>{this.props.user.username}</b>!</h1>
        <h3>Select a song or <em><Link to="/lyrics-form">add a new song</Link></em>.</h3>
        <div>
          {this.getSongs()}
        </div>
        <Link to="/"><button onClick={() => { this.props.onSignOut() }} className="btn btn-primary">
          Sign Out
        </button></Link>
      </div>
    )
  }

  getSongs() {
    if (this.props.user.songs.length > 0) {
      let pieces = this.props.user.songs.map((song) => {
        return this.getCard(song)
      })
      return pieces
    } else {
      return <h5>You don't have any songs to show...</h5>
    }
  }

  getCard(song) {
    return (
      <div key={song.title} className="card mb-2">
        <div className="card-body">
          <h5 className="card-title">{song.title}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{song.author}</h6>
          <p className="card-text">{song.lyrics[0]}...</p>
          <Link to="/presentation" className="card-link" onClick={() => this.props.onSelectSong({
            lyrics: song.lyrics,
            author: song.author,
            title: song.title,
            timeStamps: song.timeStamps
          })}>
            Show
          </Link>
          <Link to="/dashboard" className="card-link" onClick={() => this.props.onDeleteSong(song.title)}>
            Delete
          </Link>
        </div>
      </div>
    )
  }
}

export default Dashboard