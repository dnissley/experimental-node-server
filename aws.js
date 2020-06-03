const AWS = require("aws-sdk")

const dynamodbClient = new AWS.DynamoDB({
  apiVersion: '2012-08-10'
})

//   dynamodbClient.getItem(
//     {
//       TableName: 'test-1',
//       Key: {
//         PK: { S: `TEST_PK::${req.params.id}` },
//         SK: { S: 'TEST_SK::1' }
//       }
//     }
//   )

module.exports = {
  dynamodbClient
}
