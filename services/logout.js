const { deleteSession } = require('../db')

async function logout ({ email, sessionId }) {
  await deleteSession({ email, sessionId })
}

module.exports = logout
