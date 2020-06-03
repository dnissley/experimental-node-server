const createAccount = require('../services/createAccount')

class AccountController {
  async createAccount(req, res) {
    if (!req.body || !req.body.email || !req.body.password) {
      return res.status(400).send()
    }
    await createAccount({email: req.body.email, password: req.body.password})
    res.status(204).send()
  }

  async login(req, res) {
    res.status(204).send()
  }
}

module.exports = AccountController
