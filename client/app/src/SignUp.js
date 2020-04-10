import React from 'react'
import { Link } from 'react-router-dom'

class SignUp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "",
      password: "",
      isValid: false
    }
  }

  render() {
    return (
      <div className="box">
        <h1>Sign Up</h1>
        <form action="/sign-up" onSubmit={(event) => this.onSubmit(event)}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" className="form-control" name="username" onChange={this.handleInputChange} />
            <small className="form-text text-muted">This will be your unique username to sign in in this app.</small>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" className="form-control" name="password" onChange={this.handleInputChange} id="password" />
            <small className="form-text text-muted">Your password must contain at least 8 characters, 1 capital letter and 1 number.</small>
          </div>
          <button method="post" className="btn btn-primary" disabled={!this.state.isValid}>Sign Up</button>
        </form>
        <br />
        <ul className="nav">
          <li className="nav-item"><Link to="/sign-in">Sign In &gt;</Link></li>
        </ul>
      </div>
    )
  }

  handleInputChange = (event) => {
    const { value, name } = event.target
    this.setState({
      [name]: value
    }, () => {
      if (this.validatePassword(this.state.password).valid) {
        document.getElementById('password').style.color = 'green'
      } else {
        document.getElementById('password').style.color = 'red'
      }
    })
  }

  onSubmit = (event) => {
    event.preventDefault()
    fetch('api/register', {
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
          this.props.history.push("/")
        } else {
          throw new Error(res.error)
        }
      })
      .catch(err => {
        alert("Sorry, we were unable to register you in the system. Try again...")
      })
  }

  validatePassword(password) {
    var lowercase_regexp = /^(?=.*[a-z]).*$/
    var uppercase_regexp = /^(?=.*[A-Z]).*$/
    var number_regexp = /^(?=.*[0-9]).*$/
    var length_regexp = /^(?=.{8,16}$).*$/

    var results = {
      lowercase: false,
      uppercase: false,
      number: false,
      length: false,
      valid: false
    }

    results.lowercase = password.match(lowercase_regexp) !== null
    results.uppercase = password.match(uppercase_regexp) !== null
    results.number = password.match(number_regexp) !== null
    results.length = password.match(length_regexp) !== null

    results.valid = results.lowercase && results.uppercase && results.number && results.length

    return results
  }
}

export default SignUp