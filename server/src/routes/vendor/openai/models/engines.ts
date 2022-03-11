import Koa from 'koa'

import { apiKeyAuth } from '../../../../middleware/auth'
import { Route } from '../../../../types'
import { modelComplete } from '../openai'

export const engines: Route[] = [
  {
    path: '/vendor/openai/v1/models/:model/engines/:engine/completions',
    access: apiKeyAuth(),
    post: async (ctx: Koa.Context) => {
      const model = ctx.params.engine
      const engine = ctx.params.engine
      const { context, ...options } = ctx.request.body
      ctx.body = await modelComplete({ ...options, engine, model }, context)
    },
  },
]
