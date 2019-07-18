const { gql } = require('apollo-server-express')

const schema = gql`
directive @requireAuth(role: Role) on FIELD_DEFINITION
enum Role {
  ADMIN
  MODERATOR
  USER
}
type User {
  _id: ID
  email: String!
  role: String
}
type Token {
  token: String
}

input UserInput {
  email: String!
  password: String!
}

type Query {
  me: User @requireAuth
  getAllUsers: [User]
  test: String @requireAuth
}

type Mutation {
  # User
  register(email: String!, password: String!): User
  login(email: String!, password: String!): User
  invalidateTokens: Boolean!
}
`

exports.schema = schema
