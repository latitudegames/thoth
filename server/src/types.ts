import Koa from 'koa'

export type Middleware = (ctx: Koa.Context, next: any) => any

export type Method =
  | 'get'
  | 'head'
  | 'post'
  | 'put'
  | 'delete'
  | 'connect'
  | 'options'
  | 'trace'
  | 'patch'

export type Handler = (ctx: Koa.Context) => any

export type Route = {
  method?: Method
  path: string
  access: string | string[] | Middleware
  middleware?: Middleware[]
  handler?: Handler
  get?: Handler
  put?: Handler
  post?: Handler
  del?: Handler
  delete?: Handler
  head?: Handler
  patch?: Handler
}

// Go-inspired function return
export type GoFn = [
  boolean, // Ok
  string | null, // Message
  any // body
]

// Elixir-inspired function return
export type ExFn = [true, any] | [false, string]
