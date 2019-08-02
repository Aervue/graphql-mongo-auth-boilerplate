const User = require('./_model')

const queryResolvers = {
  Query: {
    getAllUsers: async (root, args, context, info) => {
      const getAllUsers = await User.find({})
      return getAllUsers
    },
    me: async (root, args, { req }) => {
      const currentUser = await User.findById({ _id: req.user.id })
      return currentUser
    },
    test: () => {
      return 'Holy shit, it works'
    }
  }
}

exports.queryResolvers = queryResolvers
