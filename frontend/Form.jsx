import React, { Component } from 'react'

class Form extends Component {
  constructor () {
    super()

    this.state = {
      email: ''
    }

    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleLogInButton = this.handleLogInButton.bind(this)
  }

  handleEmailChange (event) {
    const { value } = event.target
    this.setState(() => {
      return { email: value }
    })
  }

  handlePasswordChange (event) {
    const { value } = event.target
    this.setState(() => {
      return { password: value }
    })
  }

  handleLogInButton (event) {
    console.log(JSON.stringify(this.state))
    event.preventDefault()
  }

  render () {
    return (
      <div>
        <form>
          <label>Email: </label>
          <input
            type='text'
            value={this.state.email}
            onChange={this.handleEmailChange}
          />
          <br />
          <label>Password: </label>
          <input
            type='password'
            value={this.state.password}
            onChange={this.handlePasswordChange}
          />
          <br />
          <button onClick={this.handleLogInButton}>Log in</button>
        </form>
      </div>
    )
  }
}

export default Form
