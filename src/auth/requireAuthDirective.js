const {
  SchemaDirectiveVisitor,
  AuthenticationError
} = require('apollo-server-express')
const { defaultFieldResolver } = require('graphql')

class RequireAuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition (field) {
    const { resolve = defaultFieldResolver } = field
    const { role } = this.args
    field.resolve = async function (...args) {
      const { req } = args[2]
      if (req.user) {
        if (role && (!req.user.role.includes(role))) {
          throw new AuthenticationError(
            'You are not authorized to view this resource.'
          )
        } else {
          const result = await resolve.apply(this, args)
          return result
        }
      } else {
        throw new AuthenticationError(
          'You must be signed in to view this resource.'
        )
      }
    }
  }
}

module.exports = RequireAuthDirective
