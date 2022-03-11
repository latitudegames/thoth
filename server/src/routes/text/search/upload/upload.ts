import fs from 'fs'
import Koa from 'koa'
import requestPromise from 'request-promise'

import { CustomError } from '../../../..//utils/CustomError'
import { apiKeyAuth } from '../../../../middleware/auth'
import { Route } from '../../../../types'

const uploadHandler = async (ctx: Koa.Context) => {
  const file = ctx?.request?.files?.file
  if (!file || Array.isArray(file)) {
    new CustomError('input-failed', 'A single file is required for upload')
  }

  const fileData = fs.readFileSync(
    `${Array.isArray(file) ? '' : file?.path}`,
    'utf8'
  )
  const formData = {
    purpose: 'search',
    file: {
      value: fileData,
      options: {
        filename: Array.isArray(file) ? '' : file?.name,
      },
    },
  }

  try {
    const response = await requestPromise.post({
      url: 'https://api.openai.com/v1/files',
      formData: formData,
      headers: { Authorization: `Bearer ${process.env.OPEN_AI_KEY}` },
    })

    ctx.body = response
  } catch (error) {
    new CustomError('open-ai-error', error.message)
  }
}

export const upload: Route[] = [
  {
    path: '/text/search/upload',
    access: apiKeyAuth(),
    post: uploadHandler,
  },
]
