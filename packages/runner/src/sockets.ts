import io from 'socket.io'

const handleSockets = (io: io.Server) => {
  io.on('connection', function (socket: io.Socket) {
    console.log('connection established with socket', socket)
  })
}

export default handleSockets
