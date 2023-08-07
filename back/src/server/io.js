const serverIo = (io) => {
  // Configuration de Socket.IO
  io.on('connection', (socket) => {
    try {
      let room = ''

      // Gérer les événements socket ici
      socket.on('connectedWithAppId', (data) => {
        // console.log('User connected with appId :', data.appId)
        socket.join(data.appId)
        room = data.appId
      })

      socket.on('leaveRoom', (data) => {
        socket.leave(data.appId)
        room = ''
      })
      socket.on('newDataAdded', () => io.to(room).emit('newDataAdded', 'new data added for room '))
      socket.on('updateUserDocument', (userAppId) => io.to(userAppId).emit('updateUserDocument'))
    } catch (error) {
      console.log(error)
    }
  })
}
module.exports = serverIo
