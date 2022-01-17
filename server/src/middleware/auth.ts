import Koa from 'koa'

// import { latitudeDatabase } from '../databases/latitude'
// import { CustomError } from '../utils/CustomError'
// import { apiKeyWithAccess } from './apiKeyWithAccess'

// type Opts = {
//   debug: boolean
//   passthrough: boolean
// }

export const apiKeyAuth = async (ctx: Koa.Context, next: Koa.Next) => { await next() }

// (
//   opts: Opts = { debug: false, passthrough: false }
// ) => {
//   const { debug, passthrough } = opts

//   return async (ctx: Koa.Context, next: () => Promise<any>) => {
//     try {
//       const key = ctx.get('x-api-key')

//       if (!key) throw new CustomError('input-failed', 'x-api-key not provided')
//       const apiKey = await latitudeDatabase.apiKeys.findOne({
//         where: { key },
//         include: { model: latitudeDatabase.users },
//       })
//       if (!apiKey) throw new CustomError('not-found', 'API Key not found')
//       const user = apiKey.user
//       if (!user) throw new CustomError('not-found', 'User not found')
//       await loginSuccessful(ctx, user)
//     } catch (err) {
//       if (!passthrough) {
//         const msg = debug ? err.message : 'Authentication Error'
//         // eslint-disable-next-line no-console
//         console.log('message', msg)
//         throw new CustomError('authentication-error', msg, err)
//       } else {
//         // downstream can handle the error here
//         ctx.state.apiKeyAuthError = err
//       }
//     }

//     return next()
//   }
// }

export const sessionOrApiKeyAuth = async (ctx: Koa.Context, next: Koa.Next) => { await next() }
export const noAuth = async (ctx: Koa.Context, next: Koa.Next) => { await next() }

//  = (ctx: Koa.Context, next: Koa.Next) => {
//   const guestAccessWhitelist: string[] = [
//     '/lab/newGame',
//     '/lab/feedback',
//     '/game/chains/deployed%20apricot/latest',
//     '/game/chains/pixelthis%20config/latest',
//     '/game/pixelthis/generations',
//   ]

//   const voyageBetaAccessWhitelist: string[] = [
//     ...guestAccessWhitelist,
//     '/user/invite',
//   ]
//   if (ctx.request.header['authorization'] && ctx.state.user.id) {
//     if (
//       ctx.state.user.groups.includes('internal') ||
//       ctx.state.user.groups.includes('lab-testers') ||
//       ctx.state.user.groups.includes('voyage-beta')
//     ) {
//       if (ctx.state.user && ctx.state.user.groups.includes('voyage-beta')) {
//         if (!voyageBetaAccessWhitelist.includes(ctx.request.path)) {
//           throw new CustomError(
//             'authentication-error',
//             'Access Denied',
//             'Service only available to internal users'
//           )
//         }
//       }

//       return next()
//     } else {
//       throw new CustomError(
//         'authentication-error',
//         'Access Denied',
//         'Service only available to internal users'
//       )
//     }
//   } else {
//     if (ctx.state.user && ctx.state.user.groups.includes('lab-guest')) {
//       if (!guestAccessWhitelist.includes(ctx.request.path)) {
//         throw new CustomError(
//           'authentication-error',
//           'Access Denied',
//           'Service only available to internal users'
//         )
//       }
//     }

//     const apiAuthDefault = apiKeyWithAccess([
//       'internal',
//       'lab-testers',
//       'lab-guest',
//     ])
//     return apiAuthDefault(ctx, next)
//   }
// }
