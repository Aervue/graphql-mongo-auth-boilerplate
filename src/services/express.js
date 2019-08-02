const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const helmet = require('helmet')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const { typeDefs, resolvers } = require('../utils/imports')

const authTokens = require('../auth/authTokens')
const requireAuthDirective = require('../auth/requireAuthDirective')
// const AnalyticsExtension = require('./analyticsExtension')

var whitelist = ['http://localhost:4000', 'http://localhost:8080']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true, credentials: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false, credentials: true } // disable CORS for this request
  }
  callback(console.log(cors), corsOptions) // callback expects two parameters: error and options
}

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives: {
      requireAuth: requireAuthDirective
    },
    context: ({ req, res }) => ({ req, res })
    // context2: ({ req }) => { return { currentUser: getUser(req.cookies['access-totken']) } }
  })

  const app = express()

  app.use(helmet())
  // app.use(cors(corsOptionsDelegate))
  app.use(cookieParser())
  app.use(authTokens)

  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: corsOptionsDelegate
    // introspection: true,
    // tracing: true,
    // extensions: [() => new AnalyticsExtension()]
  })

  app.listen({ port: process.env.PORT }, () =>
    console.log(`Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`)
  )
}

module.exports = startServer
