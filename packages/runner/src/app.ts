import io from 'socket.io'
import path from 'path'
import favicon from 'serve-favicon'
import compress from 'compression'
import helmet from 'helmet'
import cors from 'cors'

import feathers from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import express from '@feathersjs/express'
import socketio from '@feathersjs/socketio'

import { Application } from './declarations'
import logger from './logger'
import middleware from './middleware'
import services from './services'
import appHooks from './app.hooks'
import channels from './channels'
import { HookContext as FeathersHookContext } from '@feathersjs/feathers'
import handleSockets from './sockets'
// import authentication from './authentication'
import { configureManager } from '@latitudegames/thoth-core/dist/server'
// Don't remove this comment. It's needed to format import lines nicely.

const app: Application = express(feathers())
export type HookContext<T = any> = { app: Application } & FeathersHookContext<T>

// Load app configuration
app.configure(configuration())
// Enable security, CORS, compression, favicon and body parsing
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
)
app.use(cors())

app.use(compress())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(favicon(path.join(app.get('public'), 'favicon.ico')))
// Host the public folder
app.use('/', express.static(app.get('public')))

// Set up Plugins and providers
app.configure(express.rest())

const socketOptions = {
  origins: ['http://localhost:3003'],

  handlePreflightRequest: (_: any, res: any) => {
    console.log('HANDLING PREFLIGHT!!')
    res.writeHead(200, {
      'Access-Control-Allow-Origin': 'http://localhost:3003',
      'Access-Control-Allow-Methods': 'GET,POST',
      'Access-Control-Allow-Headers': 'Authorization',
      'Access-Control-Allow-Credentials': true,
    })
    res.end()
  },
}

// configures this needed for the spellManager
app.configure(configureManager())
// Begins the entrypoint or where we handle our sockets
app.configure(
  // This is hacky.  But some socket options are required by typescript, but the library uses defaults.
  socketio(socketOptions as unknown as io.ServerOptions, handleSockets(app))
)

// Configure other middleware (see `middleware/index.ts`)
app.configure(middleware)
// app.configure(authentication)
// Set up our services (see `services/index.ts`)
app.configure(services)
// Set up event channels (see channels.ts)
app.configure(channels)

// Configure a middleware for 404s and the error handler
app.use(express.notFound())
app.use(express.errorHandler({ logger } as any))

app.hooks(appHooks)

export default app
