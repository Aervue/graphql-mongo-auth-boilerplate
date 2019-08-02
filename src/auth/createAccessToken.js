const { sign } = require('jsonwebtoken')

const createAccessToken = (user, secret, expiresIn) => {
  const { id, role } = user
  return sign({ id, role }, secret, { expiresIn })
}

exports.createAccessToken = createAccessToken
