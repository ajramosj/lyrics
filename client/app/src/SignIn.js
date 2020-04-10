import React from 'react'
import { Link } from 'react-router-dom'

class SignIn extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "",
      password: ""
    }
  }

  render() {
    return (
      <div className="box">
        <h1>Sign In</h1>
        <form action="/sign-in" onSubmit={(event) => this.onSubmit(event)}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" className="form-control" name="username" onChange={this.handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" className="form-control" name="password" onChange={this.handleInputChange} />
          </div>
          <button method="post" className="btn btn-primary">Sign In</button>
        </form>
        <br />
        <ul className="nav">
          <li className="nav-item"><Link to="/sign-up">&lt; Sign Up</Link></li>
        </ul>
      </div>
    )
  }

  handleInputChange = (event) => {
    const { value, name } = event.target
    this.setState({
      [name]: value
    })
  }

  onSubmit = (event) => {
    event.preventDefault()
    fetch('/api/authenticate', {
      credentials: "same-origin",
      method: 'POST',
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status === 200) {
          res.json().then((user) => {
            this.props.onGetUserData(user)
          })
          this.props.history.push("/dashboard")
        } else {
          throw new Error(res.error)
        }
      })
      .catch(err => {
        alert("Sorry, we were unable to log you in. Try again...")
      })
  }
}


export default SignIn