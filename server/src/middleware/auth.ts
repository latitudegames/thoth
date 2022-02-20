import Koa from 'koa'

// TODO: Handle these

export const noAuth = async (ctx: Koa.Context, next: Koa.Next) => {
  await next()
}

export const apiKeyAuth = () => {
  return noAuth
}

export const apiKeyWithAccess = (v: any) => {
  return noAuth
}
