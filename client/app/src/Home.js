import React from 'react'
import { Link } from 'react-router-dom'

import Logo from './undraw_compose_music_ovo2.png'

class Home extends React.Component {
  render() {
    return (
      <div className="box text-center">
        <h1>LYRICS</h1>
        <h2>Sync lyrics <span role="img" aria-label="lyrics">📃</span> with your favorite songs <span role="img" aria-label="music">🎵</span>.</h2>
        <img src={Logo} alt="Logo" className="logo" />
        <br />
        <Link to="/sign-in"><button type="button" to="/sign-in" className="btn btn-primary">Sign In</button></Link>
        &nbsp;or&nbsp;
        <Link to="/sign-up"><button type="button" className="btn btn-secondary">Sign Up</button></Link>
      </div>
    )
  }
}

export default Home