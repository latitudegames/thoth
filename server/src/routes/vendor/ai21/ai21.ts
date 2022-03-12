// import Encoder from 'gpt-3-encoder'
import Koa from 'koa'
import { performance } from 'perf_hooks'
import { post } from 'request-promise'

// import { eventsDatabase } from '../../../databases/events'
import { apiKeyAuth } from '../../../middleware/auth'
import { Route } from '../../../types'
import { CustomError } from '../../../utils/CustomError'
import { CompletionContext } from '../../../utils/modelRequest'
import { ModelCompletionOpts } from '../openai/openai'

const AI21_AUTH = `Bearer ${process.env.AI21_KEY}`

const MAX_GENERATION_TOKENS = 256

enum AI21Models {
  'j1-large',
  'j1-jumbo',
  'ai-dungeon-jumbo-v0.1',
  'ai-dungeon-large-v0.1',
  'ai-dungeon-large-v0.2',
  'ai-dungeon-large-v0.3',
  'ai-dungeon-jumbo-v1.1-early',
  'ai-dungeon-jumbo-v0.1-early',
  'ai-dungeon-jumbo-v1.1-late',
}

export const ai21 = async (
  options: Partial<ModelCompletionOpts>,
  context: CompletionContext
): Promise<AI21CompletionResponse | null> => {
  const {
    model = AI21Models[AI21Models['j1-large']],
    prompt,
    n,
    temperature,
    maxTokens = MAX_GENERATION_TOKENS,
    logitBias,
    stop,
    presencePenalty,
    frequencyPenalty,
    countPenalty, // AI21's count penalty is implemented the same as other OpenAI's frequency penalty. Their frequency penalty is count / num tokens
  } = options
  const t0 = performance.now()

  // An AI 21 token is more characters on average. Also the engine is only configured for a max of 60 generation tokens.
  const modifiedMaxTokens = Math.min(Math.floor(maxTokens * (4.5 / 6)), 60)

  const request = {
    url:
      model === 'j1-jumbo'
        ? `https://api.ai21.com/studio/v1/j1-jumbo-latitude/complete`
        : `https://api.ai21.com/studio/v1/j1-jumbo-latitude/${model}/complete`,
    body: {
      prompt,
      maxTokens: modifiedMaxTokens,
      numResults: n,
      logitBias: logitBias,
      stopSequences: stop ? [stop] : [],
      temperature: temperature,
      presencePenalty: { scale: presencePenalty ?? 0.0 },
      countPenalty: { scale: countPenalty ?? 0.0 },
      frequencyPenalty: { scale: frequencyPenalty ?? 0.0 },
    },
    json: true,
    headers: {
      Authorization: AI21_AUTH,
    },
  }
  const result = await post(request).catch((err: Error) => {
    throw new CustomError('ai21-error', err.message, JSON.stringify(err))
  })
  const t1 = performance.now()
  const durationMs = t1 - t0

  // const requestTokenCount = Encoder.encode(options.prompt).length
  // const responseText = result.completions
  //   .map((completion: AI21Completion) => completion.data.text)
  //   .join(' ')
  // const responseTokenCount = result ? Encoder.encode(responseText).length : null
  // const latitudeApiProductId = process.env.LATITUDE_API_PRODUCT_ID || ''

  // const modelRequest = await eventsDatabase.modelRequests
  //   .create(
  //     {
  //       request: { ...options },
  //       requestTokenCount,
  //       productId: latitudeApiProductId,
  //       vendorName: 'ai21',
  //       vendorModel: model,
  //       vendorEngine: model,
  //       vendorCompletionId: result ? result.id : null,
  //       responseCode: result ? 200 : 500,
  //       response: result,
  //       responseDurationMs: durationMs,
  //       responseTokenCount,
  //       userId: context?.userId,
  //       productTaskName: context?.productTaskName,
  //       productMetadata: context?.productMetadata,
  //       fewshotText: context?.fewshotText,
  //     },
  //     { returning: ['id'] }
  //   )
  //   .catch(() => {}) // Alan - ignoring errors here so a logging failure doesn't block generation.

  if (!result) {
    return null
  }
  return { ...result, durationMs, /* modelRequestId: modelRequest?.id */ }
}

export const ai21Tokens = async (
  text: String
): Promise<AI21TokensResponse | null> => {
  const t0 = performance.now()
  const request = {
    url: `https://api.ai21.com/studio/v1/tokenize`,
    body: {
      text,
    },
    json: true,
    headers: {
      Authorization: AI21_AUTH,
    },
  }
  const result = await post(request).catch((err: Error) => {
    throw new CustomError('ai21-error', err.message, JSON.stringify(err))
  })
  const t1 = performance.now()
  const durationMs = t1 - t0

  return { ...result, durationMs }
}

export type GeneratedToken = {
  logprob: number
  token: string
}

export type TextRange = {
  end: number
  start: number
}

export type Token = {
  generatedToken: GeneratedToken
  textRange: TextRange
  topTokens?: any
}

export type AI121Data = {
  text: string
  tokens: Token[]
}

export type FinishReason = {
  reason: string
  sequence: string
}

export type AI21Completion = {
  data: AI121Data
  finishReason: FinishReason
}

export type Prompt = {
  text: string
  tokens: Token[]
}

export type AI21CompletionResponse = {
  completions: AI21Completion[]
  id: string
  prompt: Prompt
  durationMs: number
  modelRequestId: string
}

type AI21TokensResponse = {
  tokens: string[]
  durationMs: number
}

export const routes: Route[] = [
  {
    path: '/vendor/ai21/v1/tokenize',
    access: apiKeyAuth(),
    post: async (ctx: Koa.Context) => {
      ctx.body = await ai21Tokens(ctx.request.body.text)
    },
  },
]
