const { sign } = require('jsonwebtoken')

const createAccessToken = (user, secret, expiresIn) => {
  const { email, role } = user
  return sign({ email, role }, secret, { expiresIn })
}

exports.createAccessToken = createAccessToken
