import 'regenerator-runtime'
import { SpellRunner } from '@latitudegames/thoth-core/dist/server'
import express from 'express'
import http from 'http'
import WebSocket from 'ws'
import ShareDB from 'sharedb'
import WebSocketJSONStream from '@teamwork/websocket-json-stream'
import { buildThothInterface } from './src/thothInterface'

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server: server })

const backend = new ShareDB()

let spellRunner

wss.on('connection', webSocket => {
  const thothInterface = buildThothInterface()
  spellRunner = new SpellRunner({ thothInterface })

  const stream = new WebSocketJSONStream(webSocket)
  backend.listen(stream)

  wss.on('message', data => {
    console.log('message received', data)
  })
})

server.listen(8080, () => {
  console.log('server listening on port 8080')
})
