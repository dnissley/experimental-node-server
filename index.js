require('dotenv').config()
const express = require('express')
const configureRoutes = require('express-routes-file')
const { dynamodbClient } = require('./aws')
const AccountController = require('./controllers/AccountController')

const accountController = new AccountController()
const app = express()
const port = 3000

app.set('view engine', 'pug')

app.use(express.urlencoded())
app.use('/static', express.static('static'))

const routes = configureRoutes({
  homePage: (req, res) => res.render('index', { title: 'Home Page', message: 'Welcome to the home page.' }),
  createAccountPage: (req, res) => res.render('index', { title: 'Create Account Page', message: 'Welcome to the create account page.' }),
  loginPage: (req, res) => res.render('index', { title: 'Login Page', message: 'Welcome to the login page.' }),
  createAccount: accountController.createAccount,
  login: accountController.login,
})

app.use('/', routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
