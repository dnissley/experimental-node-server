require('dotenv').config()
const express = require('express')
const configureRoutes = require('express-routes-file')
const { dynamodbClient } = require('./aws')
const app = express()
const port = 3000

app.set('view engine', 'pug')

app.use('/static', express.static('static'))

const routes = configureRoutes({
  index: (req, res) => res.render('index', { title: 'Hey', message: 'Hello there!' }),
  login: (req, res) => res.render('index', { title: 'asdfasdf', message: 'bla bla bla' }),
  get: (req, res) => {
    dynamodbClient.getItem(
      {
        TableName: 'test-1',
        Key: {
          PK: { S: 'TEST_PK::1' },
          SK: { S: 'TEST_SK::1' }
        }
      },
      (err, data) => {
        if (err) {
          res.status(500).json(err)
        } else {
          res.status(200).json(data)
        }
      }
    )
  },
  put: (req, res) => {
    dynamodbClient.putItem(
      {
        TableName: 'test-1',
        Item: {
          PK: { S: 'TEST_PK::1' },
          SK: { S: 'TEST_SK::1' },
          stringProperty: { S: 'this is a string property' },
          numberProperty: { N: '1234' },
          booleanProperty1: { BOOL: true },
          booleanProperty2: { BOOL: false },
          mapProperty: {
            M: {
              mapProperty1: { S: 'this is a nested property' }
            }
          },
          listProperty: {
            L: [
              { S: 'first list item' },
              { S: 'second list item' },
              { S: 'third list item' } 
            ]
          },
          stringSetProperty: {
            SS: [
              'first set item',
              'second set item',
              'third set item'
            ]
          },
          nullProperty: { NULL: true },
        }
      },
      (err, data) => {
        if (err) {
          res.status(500).json(err)
        } else {
          res.status(200).json(data)
        }
      }
    )
  }
})

app.use('/', routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
