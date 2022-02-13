import Koa from 'koa'

import { apiKeyAuth } from '../../../middleware/auth'
import { search as searchHelper } from '../../../routes/vendor/openai/openai'
import { Route } from '../../../types'
import { CustomError } from '../../../utils/CustomError'

const searchHandler = async (ctx: Koa.Context) => {
  const { engine, documents, file, query, maxRerank, returnMetadata } =
    ctx.request.body
  if (documents && file) {
    throw new CustomError(
      'input-failed',
      'documents and file parameters are mutually exclusive'
    )
  }
  const searchResult = await searchHelper({
    engine,
    documents,
    file,
    query,
    maxRerank,
    returnMetadata,
  })
  ctx.body = searchResult
}

export const search: Route[] = [
  {
    path: '/text/search',
    access: apiKeyAuth(),
    post: searchHandler,
  },
]
