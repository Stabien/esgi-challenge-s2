const createServer = require('./server')
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

// Configuration de Socket.IO
io.on('connection', (socket) => {
  console.log("Un utilisateur s'est connecté")

  // Gérer les événements socket ici
  socket.on('message', (data) => {
    console.log('Message reçu :', data)
    // Vous pouvez diffuser le message à tous les autres clients connectés
    // io.emit('message', data);
  })

  // Gérer la déconnexion de l'utilisateur
  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté')
  })
})

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
