import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Home from './Home'
import SignIn from './SignIn'
import SignUp from './SignUp'
import LyricsForm from './LyricsForm'
import LyricsPresentation from './LyricsPresentation'
import Dashboard from './Dashboard'

import './App.css'

const defaultUser = {
  username: "",
  songs: []
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: defaultUser,
      selectedSong: {
        lyrics: null,
        author: null,
        title: null,
        timeStamps: null,
      }
    }
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/sign-in" render={props => <SignIn {...props} onGetUserData={this.getUserData} />}></Route>
          <Route path="/sign-up" render={props => <SignUp {...props} />}></Route>
          <Route path="/dashboard" render={props => <Dashboard {...props} user={this.state.user} onSignOut={this.signOut} onSelectSong={this.selectSong} onDeleteSong={this.deleteSong} />}></Route>
          <Route path="/lyrics-form" render={props => <LyricsForm {...props} onAddSong={this.addSong} />}></Route>
          <Route path="/presentation" render={props => <LyricsPresentation {...props} song={this.state.selectedSong} />}></Route>
          <Route path="/" render={props => <Home {...props} />}></Route>
        </Switch>
      </Router>
    )
  }

  selectSong = (song) => {
    this.setState({
      selectedSong: {
        lyrics: song.lyrics,
        author: song.author,
        title: song.title,
        timeStamps: song.timeStamps
      }
    })
  }

  addSong = (song) => {
    fetch('/api/songs/add', {
      credentials: "same-origin",
      method: 'POST',
      body: JSON.stringify({
        song: song
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status === 200) {
          res.json().then((user) => {
            this.setState({
              user: user
            })
          })
        } else {
          throw new Error(res.error)
        }
      })
      .catch(err => {
        alert("Sorry, we were unable to add the song. Try again...")
      })
  }

  deleteSong = (songTitle) => {
    fetch('/api/songs/delete', {
      credentials: "same-origin",
      method: 'POST',
      body: JSON.stringify({
        songTitle: songTitle
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status === 200) {
          res.json().then((user) => {
            this.setState({
              user: user
            })
          })
        } else {
          throw new Error(res.error)
        }
      })
      .catch(err => {
        alert("Sorry, we were unable to delete the song. Try again...")
      })
  }

  getUserData = (user) => {
    this.setState({
      user: user
    })
  }

  signOut = () => {
    this.setState({
      user: defaultUser
    })
  }
}

export default App