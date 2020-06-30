require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const configureRoutes = require('express-routes-file')
const AccountController = require('./controllers/AccountController')

const accountController = new AccountController()
const app = express()
const port = 3000

app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/', express.static('static'))

const routes = configureRoutes({
  healthcheck: (req, res) => { res.send({ healthy: true }).status(200) },
  createAccount: accountController.createAccount,
  login: accountController.login,
  logout: accountController.logout
})

app.use('/', routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
