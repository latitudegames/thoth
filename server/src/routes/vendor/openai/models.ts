import Koa from 'koa'

import { apiKeyAuth } from '../../../middleware/auth'
import { Route } from '../../../types'
import { modelComplete } from './openai'

// models provides a layer of abstraction over raw engines
// so devs don't have to worry about engine names changes.
export const models: Route[] = [
  {
    path: '/vendor/openai/v1/models/:model/completions',
    access: apiKeyAuth(),
    post: async (ctx: Koa.Context) => {
      const model = ctx.params.model
      const { context, ...options } = ctx.request.body
      ctx.body = await modelComplete({ ...options, model }, context)
    },
  },
]
