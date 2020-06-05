const bcrypt = require('bcrypt')
const uuid = require('uuid')
const { fetchUserByEmail, insertSession } = require('../db')
const { AuthorizationError } = require('../errors')

async function login ({ email, password }) {
  const user = await fetchUserByEmail({ email })
  const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
  if (!passwordCorrect) {
    throw new AuthorizationError('Wrong Password')
  }
  const sessionId = uuid.v4()
  await insertSession({ email, sessionId })
  return sessionId
}

module.exports = login
