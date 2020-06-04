const bcrypt = require('bcrypt')
const { fetchUser } = require('../db')
const { AuthorizationError } = require('../errors')

async function login({ email, password }) {
  const user = await fetchUser(email)
  console.log(`bcrypt.compare(${password}, ${user.passwordHash})`)
  const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
  if (!passwordCorrect) {
    throw new AuthorizationError('Wrong Password')
  }
  return user
  // TODO: session insertion logic here
  // TODO: return session key
}

module.exports = login
