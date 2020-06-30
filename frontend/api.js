import ky from 'ky'

const logIn = (email, password) => ky.post('login', {
  json: {
    email,
    password
  }
})

const logOut = (email, password) => ky.post('logout')

export default {
  logIn,
  logOut
}
