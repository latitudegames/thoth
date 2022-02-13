// import Encoder from 'gpt-3-encoder'
import OpenAI from 'openai-api'
import { performance } from 'perf_hooks'

import { CompletionContext } from '../../../utils/modelRequest'
// import { eventsDatabase } from './../../../databases/events'
import { ExFn } from './../../../types'
import { CustomError } from './../../../utils/CustomError'
import { formatOpenAIResponse } from './../../../utils/UniversalModelResponse'

const modelEngines: Record<string, string> = {
  babbage: 'babbage',
  'curie-aidungeon-world-info': 'curie-aidungeon-world-info',
  'curie-aidungeon': 'curie-aidungeon',
  'davinci-aidungeon': 'davinci-aidungeon',
  'davinci-cached': 'davinci',
  'davinci-instruct': 'davinci-instruct-beta',
  'davinci-summaries': 'davinci-aidungeon-ft-summary',
  davinci: 'davinci',
}

const apikey = process.env.OPEN_AI_KEY || ''
const openai = new OpenAI(apikey)

export const modelComplete = (
  options: ModelCompletionOpts,
  context: CompletionContext
) => {
  const { model, ...remainder } = options
  const engine = modelEngines[model]
  if (!engine) throw new CustomError('input-failed', 'invalid model')
  return complete({ ...remainder, engine }, { ...context })
}

export const search = async (options: SearchOpts) => {
  const { engine = 'davinci' } = options
  const response = await openai.search({
    ...options,
    engine,
  })
  return response?.data
}

export const complete = async (
  options: CompletionOpts,
  context: CompletionContext = {}
) => {
  const t0 = performance.now()

  const [success, response] = await openaiComplete({ ...options })
  if (!success) throw new CustomError('open-ai-error', response)
  const t1 = performance.now()
  const durationMs = t1 - t0

  // const requestTokenCount = Encoder.encode(options.prompt).length
  // // Need special handling for echo to avoid overcounting response tokens
  // const universalResponse = formatOpenAIResponse(
  //   response,
  //   options.prompt as string,
  //   options.echo
  // )
  // const responses =
  //   universalResponse?.completions?.map((v: { text: string }) => v.text) ?? []
  // const responseTokenCount = success
  //   ? Encoder.encode(responses.join(' ')).length
  //   : null

  // const latitudeApiProductId = process.env.LATITUDE_API_PRODUCT_ID || ''
  // const modelRequest = await eventsDatabase.modelRequests
  //   .create(
  //     {
  //       request: { ...options },
  //       requestTokenCount,
  //       productId: context?.productId ?? latitudeApiProductId,
  //       vendorName: 'openai',
  //       vendorModel: options.engine,
  //       vendorEngine: options.engine,
  //       vendorCompletionId: success ? response.id : null,
  //       responseCode: success ? 200 : 500,
  //       response,
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
  return success
    ? { ...response, durationMs, /* modelRequestId: modelRequest?.id */ }
    : {}
}

const truncateObject = (object: Object | undefined, length: number) => {
  if (!object) return object
  const entries = Object.entries(object)
  return Object.fromEntries(entries?.slice(0, length))
}

const openaiComplete = async ({
  logitBias,
  ...options
}: CompletionOpts): Promise<ExFn> => {
  try {
    // the library corrupts the passed in object, so always spread here
    const response = await openai.complete({
      logitBias: truncateObject(logitBias, 300),
      ...options,
    })
    return [true, response.data]
  } catch (error) {
    return [false, error.message]
  }
}

export type ModelCompletionOpts = {
  model: string
  prompt?: string
  text?: string
  maxTokens?: number
  temperature?: number
  topP?: number
  n?: number
  stream?: boolean
  logprobs?: number
  echo?: boolean
  stop?: string | string[]
  presencePenalty?: number
  frequencyPenalty?: number
  countPenalty?: number
  bestOf?: number
  user?: string
  logitBias?: { [token: string]: number }
  badWords?: string[]
}

export type CompletionOpts = {
  engine: string
  prompt?: string
  maxTokens?: number
  temperature?: number
  topP?: number
  n?: number
  stream?: boolean
  logprobs?: number
  echo?: boolean
  stop?: string | string[]
  presencePenalty?: number
  frequencyPenalty?: number
  bestOf?: number
  user?: string
  logitBias?: { [token: string]: number }
}

export type SearchOpts = {
  engine: string
  documents?: string[]
  file?: string
  query: string
  maxRerank?: number
  returnMetadata?: boolean
}
