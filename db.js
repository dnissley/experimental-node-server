const { dynamodbClient } = require('./aws')
const { BadRequestError } = require('./errors')

async function insertUser({ email, passwordHash }) {
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
        email: { S: email },
        passwordHash: { S: passwordHash }
      }
    }).promise()
  } catch (err) {
    if (err.code === 'ConditionalCheckFailedException') {
      // the user exists already
      throw new BadRequestError('An account already exists for that email address.')
    } else {
      err.statusCode = 500
      throw err
    }
  }
}

async function fetchUser(email) {
  try {
    const data = await dynamodbClient.getItem({
      TableName: process.env.DYNAMO_TABLE,
      Key: {
        PK: { S: `USER::${email}` },
        SK: { S: 'METADATA' }
      }
    }).promise()
    return {
      email: data.Item.email.S,
      passwordHash: data.Item.passwordHash.S
    }
  } catch (err) {
    console.error('error in fetchUser:', err)
    throw err
    // if user not found: return null
    // if some other error... ???
  }
}

module.exports = {
  insertUser,
  fetchUser
}
