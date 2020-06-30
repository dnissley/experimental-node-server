import ky from 'ky'

const logIn = (email, password) => ky.post('login', {
  json: {
    email,
    password
  }
})

export default {
  logIn
}
