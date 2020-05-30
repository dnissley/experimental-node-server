const AWS = require("aws-sdk")

const dynamodbClient = new AWS.DynamoDB({
  apiVersion: '2012-08-10'
})

module.exports = {
  dynamodbClient
}
