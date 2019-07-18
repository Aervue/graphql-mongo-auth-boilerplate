const connectDB = require('./services/mongoose')
const startServer = require('./services/express')

connectDB()
startServer()
