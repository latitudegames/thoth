import Koa from 'koa'

export const noAuth = async (ctx: Koa.Context, next: Koa.Next) => { await next() }