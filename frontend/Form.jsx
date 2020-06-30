import React, { useEffect, useState } from 'react'
import getCookie from './utilities/getCookie'
import { USERNAME_COOKIE } from './constants'
import api from './api'

const Form = () => {
  const [loggedInUsername, setLoggedInUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const updateLoggedInUsername = () => {
    setLoggedInUsername(getCookie(USERNAME_COOKIE))
  }

  useEffect(updateLoggedInUsername)

  const logIn = (e) => {
    api.logIn(email, password).then(() => {
      updateLoggedInUsername()
    })
    e.preventDefault()
  }

  const logOut = (e) => {
    api.logOut().then(() => {
      updateLoggedInUsername()
    })
    e.preventDefault()
  }

  const status = loggedInUsername ? `Logged in as ${loggedInUsername}` : 'Not logged in'

  return (
    <div>
      <div>Status: {status}</div>
      <form>
        <label>Email: </label>
        <input
          type='text'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label>Password: </label>
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button onClick={logIn}>Log in</button>
        <br />
        <button onClick={logOut}>Log out</button>
      </form>
    </div>
  )
}

export default Form
