const bcrypt = require('bcrypt')
const { dynamodbClient } = require('../aws')

async function createAccount({ email, password }) {
  const passwordHash = await bcrypt.hash(password, 10)
  try {
    const response = await dynamodbClient.putItem({
      TableName: 'test-1',
      ConditionExpression: 'attribute_not_exists(#pk)',
      ExpressionAttributeNames: {
        '#pk': 'PK'
      },
      Item: {
        PK: { S: `USER::${email}` },
        SK: { S: 'METADATA' },
        email: { S: email },
        passwordHash: { S: passwordHash }
      }
    }).promise()
    console.log('createAccount response: ', response)
  } catch (err) {
    console.error('createAccount error response: ', err)
    throw err;
  }
}

module.exports = createAccount
