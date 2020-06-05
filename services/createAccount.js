const bcrypt = require('bcrypt')
const { insertUser } = require('../db')

async function createAccount ({ email, password }) {
  const passwordHash = await bcrypt.hash(password, 10)
  await insertUser({
    email,
    passwordHash
  })
}

module.exports = createAccount
