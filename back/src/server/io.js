const serverIo = (io) => {
  // Configuration de Socket.IO
  io.on('connection', (socket) => {
    let room = ''
    console.log("Un utilisateur s'est connecté")

    // Gérer les événements socket ici
    socket.on('connectedWithAppId', (data) => {
      console.log('User connected with appId :', data.appId)
      socket.join(data.appId)
      room = data.appId
      console.log('joined room:', room)
      io.to(room).emit('message', 'this is a message for users in room ')
      // Vous pouvez diffuser le message à tous les autres clients connectés
      io.emit('message', 'this is a message for everyone')
    })

    socket.on('leaveRoom', (data) => {
      console.log('Utilisateur leave room', data.appId)
      socket.leave(data.appId)
      room = ''

      console.log('leaving room:', room)
    })
    // Gérer la déconnexion de l'utilisateur
    socket.on('disconnect', () => {
      console.log('Utilisateur déconnecté')
    })
  })
}
module.exports = serverIo
