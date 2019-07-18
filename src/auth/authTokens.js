const { verify } = require('jsonwebtoken')
const { createAccessToken } = require('./createAccessToken')

const User = require('../components/User/_model')

const authTokens = async (req, res, next) => {
  // Import AT & RT tokens (if any)
  const accessToken = req.cookies['access-token']
  const refreshToken = req.cookies['refresh-token']

  // If there are no tokens, exit function
  if (!refreshToken && !accessToken) {
    return next()
  }

  // Check access token validty, if valid, add user from JWT payload to express's req object and exit function (this means we are authenticated)
  try {
    const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    req.user = data.email
    return next()
  } catch (err) {
    //
  }

  // If there is no RT to generate new AT, exit function
  if (!refreshToken) {
    return next()
  }

  // Validate RT by associating it with a user from the database, if valid, store the value in refreshUser to later generate a new AT
  let refreshUser
  try {
    refreshUser = await User.findOne({ refreshToken: refreshToken })
  } catch (err) {
    // If the database experiences an error, exit function
    return next()
  }

  // If there is a valid RT associated with a user, generate a new AT
  if (refreshUser) {
    const newAccessToken = createAccessToken(refreshUser, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRATION)
    await res.cookie('access-token', newAccessToken)
    req.user = refreshUser.email
    // console.log(req.cookies['access-token'])
  }

  next()
}

module.exports = authTokens
