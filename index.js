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
          PK: { S: `TEST_PK::${req.params.id}` },
          SK: { S: 'TEST_SK::1' }
        }
      },
      (err, data) => {
        if (err) {
          res.status(500).json(err)
        } else {
          console.log(JSON.stringify(data))
          res.status(200).json(data)
        }
      }
    )
  },
  put: (req, res) => {
    dynamodbClient.putItem(
      {
        TableName: 'test-1',
        ConditionExpression: 'attribute_not_exists(#pk) AND attribute_not_exists(#sk)',
        ExpressionAttributeNames: {
          '#pk': 'PK',
          '#sk': 'SK'
        },
        Item: {
          PK: { S: `TEST_PK::${req.params.id}` },
          SK: { S: 'TEST_SK::1' },
          testProperty: { S: 'hi' }
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
