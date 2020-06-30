import React, { useEffect, useState } from 'react'
import getCookie from './utilities/getCookie'
import { USERNAME_COOKIE } from './constants'
import api from './api'

const Form = () => {
  const [loggedInUsername, setLoggedInUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  useEffect(() => {
    console.log('useEffect')
    setLoggedInUsername(getCookie(USERNAME_COOKIE))
  })

  const logIn = (e) => {
    api.logIn(email, password).then(() => setLoggedInUsername(getCookie(USERNAME_COOKIE)))
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
      </form>
    </div>
  )
}

export default Form
