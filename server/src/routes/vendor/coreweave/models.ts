import Koa from 'koa'

import { apiKeyAuth } from '../../../middleware/auth'
import { Route } from '../../../types'
import { modelComplete } from './coreweave'

export const models: Route[] = [
  {
    path: '/vendor/coreweave/v1/models/:model/engines/:engine/completions',
    access: apiKeyAuth(),
    post: async (ctx: Koa.Context) => {
      const model = ctx.params.model
      const engine = ctx.params.engine
      const { context, ...options } = ctx.request.body
      ctx.body = await modelComplete({ ...options, engine, model }, context)
    },
  },
]
