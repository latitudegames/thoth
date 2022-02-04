//@ts-ignore
import cors from "@koa/cors"
import Router from '@koa/router'
import cors_server from "@latitudegames/thoth-core/src/superreality/cors-server"
import { database } from "@latitudegames/thoth-core/src/superreality/database"
import roomManager from "@latitudegames/thoth-core/src/superreality/roomManager"
import { runClients } from "@latitudegames/thoth-core/src/superreality/runClients"
import { config } from "dotenv"
import HttpStatus from 'http-status-codes'
import Koa from 'koa'
import koaBody from 'koa-body'
import compose from 'koa-compose'
import { creatorToolsDatabase } from './databases/creatorTools'
import { routes } from './routes'
import { Handler, Method, Middleware } from './types'

config({ path: '.env' })

export const app: Koa = new Koa()
const router: Router = new Router()

// required for some current consumers (i.e Thoth)
// to-do: standardize an allowed origin list based on env values or another source of truth?
const options = {
  origin: '*',
}
app.use(cors(options))

new cors_server(process.env.CORS_PORT, '0.0.0.0');

const db = new database();

async function initLoop() {
  // new worldManager(1, customConfig.instance.getInt('fps'));
  new roomManager();
  const expectedServerDelta = 1000 / 60;
  let lastTime = 0;

  // @ts-ignore
  globalThis.requestAnimationFrame = (f) => {
    const serverLoop = () => {
      const now = Date.now();
      if (now - lastTime >= expectedServerDelta) {
        lastTime = now;
        f(now);
      } else {
        setImmediate(serverLoop);
      }
    }
    serverLoop()
  }

  await runClients();
};

(async function () {
  await creatorToolsDatabase.sequelize.sync({ force: !!process.env.REFRESH_DB });
  console.log("Database synced, starting loop");



  process.on('unhandledRejection', (err: Error) => {
    console.error('Unhandled Rejection:' + err + ' - ' + err.stack);
  });


  // end of super reality app


  // Middleware used by every request. For route-specific middleware, add it to you route middleware specification
  app.use(koaBody({ multipart: true }))

  const createRoute = (
    method: Method,
    path: string,
    middleware: Middleware[],
    handler: Handler
  ) => {
    // This gets a typescript error
    // router[method](path, compose(_middleware), handler);
    // TODO: Fix this hack:
    switch (method) {
      case 'get':
        router.get(path, compose(middleware), handler)
        break
      case 'post':
        router.post(path, compose(middleware), handler)
        break
      case 'put':
        router.put(path, compose(middleware), handler)
        break
      case 'delete':
        router.delete(path, compose(middleware), handler)
        break
      case 'head':
        router.head(path, compose(middleware), handler)
        break
      case 'patch':
        router.patch(path, compose(middleware), handler)
        break
    }
  }

  type MiddlewareParams = {
    access: string | string[] | Middleware
    middleware: Middleware[] | undefined
  }

  const routeMiddleware = ({ access, middleware = [] }: MiddlewareParams) => {
    if (!access) return [...middleware]
    if (typeof access === 'function')
      return [access, ...middleware]
    if (typeof access === 'string')
      return [
        ...middleware,
      ]
    return [...middleware]
  }

  // Create Koa routes from the routes defined in each module
  routes.forEach(route => {
    const { method, path, access, middleware, handler } = route
    const _middleware = routeMiddleware({ access, middleware })
    if (method && handler) {
      createRoute(method, path, _middleware, handler)
    }
    if (route.get) {
      createRoute('get', path, _middleware, route.get)
    }
    if (route.put) {
      createRoute('put', path, _middleware, route.put)
    }
    if (route.post) {
      createRoute('post', path, _middleware, route.post)
    }
    if (route.delete) {
      createRoute('delete', path, _middleware, route.delete)
    }
    if (route.head) {
      createRoute('head', path, _middleware, route.head)
    }
    if (route.patch) {
      createRoute('patch', path, _middleware, route.patch)
    }
  })

  app.use(router.routes()).use(router.allowedMethods())

  // generic error handling
  app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
    try {
      await next()
    } catch (error) {
      ctx.status =
        error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR
      error.status = ctx.status
      ctx.body = { error }
      ctx.app.emit('error', error, ctx)
    }
  });

  await initLoop();
})()