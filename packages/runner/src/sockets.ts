import io from 'socket.io'
import { SpellManager } from '@latitudegames/thoth-core/dist/server'

const managerMap = {}

const handleSockets = (io: io.Server) => {
  io.on('connection', function (socket: io.Socket) {
    console.log('handshake headers', socket.handshake.headers)
    // Authenticate with the auth headers here
    const spellManager = new SpellManager()
  })
}

export default handleSockets
