const { dynamodbClient } = require('./aws')
const { AuthorizationError, BadRequestError } = require('./errors')

async function insertUser ({ email, passwordHash }) {
  try {
    await dynamodbClient.putItem({
      TableName: process.env.DYNAMO_TABLE,
      ConditionExpression: 'attribute_not_exists(#pk)',
      ExpressionAttributeNames: {
        '#pk': 'PK'
      },
      Item: {
        PK: { S: `USER::${email}` },
        SK: { S: 'METADATA' },
        TYPE: { S: 'USER_METADATA' },
        email: { S: email },
        passwordHash: { S: passwordHash }
      }
    }).promise()
  } catch (err) {
    if (err.code === 'ConditionalCheckFailedException') {
      throw new BadRequestError('An account already exists for that email address.')
    } else {
      err.statusCode = 500
      throw err
    }
  }
}

async function fetchUserByEmail ({ email }) {
  try {
    const response = await dynamodbClient.getItem({
      TableName: process.env.DYNAMO_TABLE,
      Key: {
        PK: { S: `USER::${email}` },
        SK: { S: 'METADATA' }
      }
    }).promise()
    if (!response.Item) {
      throw new AuthorizationError('Wrong Password')
    }
    return {
      email: response.Item.email.S,
      passwordHash: response.Item.passwordHash.S
    }
  } catch (err) {
    err.statusCode = 500
    throw err
  }
}

// async function fetchUserBySessionId ({ sessionId }) {
//   try {
//     const response = await dynamodbClient.query({
//       TableName: process.env.DYNAMO_TABLE
//     })
//   } catch (err) {
//     err.statusCode = 500
//     throw err
//   }
// }

async function insertSession ({ email, sessionId }) {
  try {
    await dynamodbClient.transactWriteItems({
      TransactItems: [
        {
          ConditionCheck: {
            TableName: process.env.DYNAMO_TABLE,
            ConditionExpression: 'attribute_exists(#pk) AND attribute_exists(#sk)',
            ExpressionAttributeNames: {
              '#pk': 'PK',
              '#sk': 'SK'
            },
            Key: {
              PK: { S: `USER::${email}` },
              SK: { S: 'METADATA' }
            }
          }
        },
        {
          Put: {
            TableName: process.env.DYNAMO_TABLE,
            Item: {
              PK: { S: `USER::${email}` },
              SK: { S: `SESSION::${sessionId}` },
              TYPE: 'USER_SESSION'
            }
          }
        }
      ]
    })
  } catch (err) {
    console.error(JSON.stringify(err))
    err.statusCode = 500
    throw err
  }
}

module.exports = {
  insertUser,
  fetchUserByEmail,
  // fetchUserBySessionId,
  insertSession
}
