class BadRequestError extends Error {
  constructor(message) {
    super(message)
    this.statusCode = 400
  }
}

class AuthorizationError extends Error {
  constructor(message) {
    super(message)
    this.statusCode = 403
  }
}

module.exports = {
  AuthorizationError
}
