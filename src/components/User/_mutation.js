const bcrypt = require('bcrypt')

const User = require('./_model')

const { createAccessToken } = require('../../auth/createAccessToken')
const { createRefreshToken } = require('../../auth/createRefreshToken')

const mutationResolvers = {
  Mutation: {
    register: async (_, { email, password }) => {
      const user = await User.findOne({ email })
      if (user) {
        throw new Error('Email already exists')
      }
      const newUser = await new User({
        email,
        password
      }).save()
      return newUser
    },
    login: async (_, { email, password }, { res }) => {
      const user = await User.findOne({ email })
      if (!user) {
        throw new Error('Credentials incorrect')
      }

      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        throw new Error('Credentials incorrect')
      }

      const accessToken = createAccessToken(user, process.env.ACCESS_TOKEN_SECRET, '5m')
      const refreshToken = createRefreshToken()

      user.refreshToken = refreshToken

      res.cookie('access-token', accessToken)
      res.cookie('refresh-token', refreshToken)

      await user.save()

      return user
    }
  }
}

exports.mutationResolvers = mutationResolvers
