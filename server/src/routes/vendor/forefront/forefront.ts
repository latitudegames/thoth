// import Encoder from 'gpt-3-encoder'
import { performance } from 'perf_hooks'
import { post } from 'request-promise'

// import { eventsDatabase } from '../../../databases/events'
import { CustomError } from '../../../utils/CustomError'
import { CompletionContext } from '../../../utils/modelRequest'
import { ModelCompletionOpts } from '../openai/openai'

const FOREFRONT_AUTH = `Bearer ${process.env.FOREFRONT_KEY}`

const MAX_GENERATION_TOKENS = 256

export const forefront = async (
  options: Partial<ModelCompletionOpts>,
  context: CompletionContext
): Promise<ForefrontCompletionResponse | null> => {
  const {
    model = '6cb8e450-vanilla-gptj-latitude',
    prompt,
    n,
    temperature,
    maxTokens = MAX_GENERATION_TOKENS,
    badWords,
    stop,
  } = options
  const t0 = performance.now()
  const request = {
    url: `https://${model}.forefront.link`,
    timeout: 20000,
    body: {
      text: prompt,
      n,
      length: maxTokens,
      temperature,
      bad_words_ids: badWords,
      stop_sequences: stop ? [stop] : [],
      // Note: we ask for the full input + response because we were
      // seeing issues with output token splitting before
      // https://latitude-games.slack.com/archives/C02NT6TEPME/p1639690152011100
      return_inputs: true,
    },
    json: true,
    headers: {
      Authorization: FOREFRONT_AUTH,
    },
  }
  const result = await post(request).catch((err: Error) => {
    throw new CustomError('forefront-error', err.message, JSON.stringify(err))
  })
  const t1 = performance.now()
  const durationMs = t1 - t0

  // const requestTokenCount = Encoder.encode(options.prompt).length
  // const responseText = result.result
  //   .map((completion: ForefrontCompletion) => completion.completion)
  //   .join(' ')
  // const responseTokenCount = result ? Encoder.encode(responseText).length : null
  // const latitudeApiProductId = process.env.LATITUDE_API_PRODUCT_ID || ''

  // const modelRequest = await eventsDatabase.modelRequests
  //   .create(
  //     {
  //       request: { ...options },
  //       requestTokenCount,
  //       productId: latitudeApiProductId,
  //       vendorName: 'forefront',
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
  return { ...result, durationMs, /* modelRequestId: modelRequest?.id, */ prompt }
}

export type ForefrontCompletion = {
  completion: string
}

export type ForefrontCompletionResponse = {
  prompt: string
  result: ForefrontCompletion[]
  durationMs: number
  timestamp: number
  modelRequestId: string
}
