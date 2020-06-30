const createAccount = require('../services/createAccount')
const login = require('../services/login')
const logout = require('../services/logout')

class AccountController {
  async createAccount (req, res) {
    if (!req.body || !req.body.email || !req.body.password) {
      return res.status(400).send()
    }
    await createAccount({
      email: req.body.email,
      password: req.body.password
    })
    res.status(204).send()
  }

  async login (req, res) {
    res.clearCookie('username')
    res.clearCookie('sessionId')
    if (!req.body || !req.body.email || !req.body.password) {
      return res.status(400).send()
    }
    const sessionId = await login({
      email: req.body.email,
      password: req.body.password
    })
    res.cookie('username', req.body.email)
    res.cookie('sessionId', sessionId, { httpOnly: true })
    res.status(200).send()
  }

  async logout (req, res) {
    if (req.cookies.username && req.cookies.sessionId) {
      await logout(req.cookies.username, req.cookies.sessionId)
    }
    res.clearCookie('username')
    res.clearCookie('sessionId')
    res.status(200).send()
  }
}

module.exports = AccountController
