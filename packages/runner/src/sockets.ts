import io from 'socket.io'

const handleSockets = (io: io.Server) => {
  io.on('connection', function (socket: io.Socket) {
    console.log('handshake headers', socket.handshake.headers)
    // Authenticate with the auth headers here
  })
}

export default handleSockets
