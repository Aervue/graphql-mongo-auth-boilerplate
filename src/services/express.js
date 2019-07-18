const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const helmet = require('helmet')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const { typeDefs, resolvers } = require('../utils/imports')

const authTokens = require('../auth/authTokens')
const requireAuthDirective = require('../auth/requireAuthDirective')

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives: {
      requireAuth: requireAuthDirective
    },
    context: ({ req, res }) => ({ req, res })
  })

  const app = express()

  app.use(helmet())
  app.use(cors())
  app.use(cookieParser())
  app.use(authTokens)

  server.applyMiddleware({
    app,
    path: '/graphql'
  })

  app.listen({ port: process.env.PORT }, () =>
    console.log(`Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`)
  )
}

module.exports = startServer
