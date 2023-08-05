// const serverIo = require('./server')
const serverIo = require('./server/io')
const bodyParser = require('body-parser')
const express = require('express')
const http = require('http')
const routes = require('./routes')
const cors = require('cors')
const socketIO = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
const PORT = 4000

// Set up CORS
app.use(cors())

// Set up bodyParser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Setting headers to allow CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
  )
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})

routes(app)
console.log(serverIo)
serverIo(io)
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
