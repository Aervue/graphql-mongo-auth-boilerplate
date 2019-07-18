const uuidv4 = require('uuid/v4')

const createRefreshToken = () => {
  return uuidv4()
}

exports.createRefreshToken = createRefreshToken
