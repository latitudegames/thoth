import express from 'express'
import http from 'http'
import WebSocket from 'ws'
import ShareDB from 'sharedb'
import WebSocketJSONStream from '@teamwork/websocket-json-stream'

const app = express()
const server = http.createServer(app)
const webSocketServer = new WebSocket.Server({ server: server })

const backend = new ShareDB()

webSocketServer.on('connection', webSocket => {
  console.log('SHARE DB RUNNING!')
  const stream = new WebSocketJSONStream(webSocket)
  backend.listen(stream)
})

server.listen(8080, () => {
  console.log('server listening on port 8080')
})
