// import Encoder from 'gpt-3-encoder'
import { performance } from 'perf_hooks'
import requestPromise from 'request-promise'
// import { v4 as uuidv4 } from 'uuid'

// TODO: For latitude we should send out this completion request
// Otherwise we should set variables for the various coreweave models

import { CustomError } from '../../../utils/CustomError'
import { CompletionContext } from '../../../utils/modelRequest'
// import { eventsDatabase } from './../../../databases/events'

// const modelUrls: Record<string, string> = {
//   gptj: 'http://gpt-j-6b.tenant-aidungeon.knative.chi.coreweave.com/v1/models/gpt-j-6b:predict',
//   'gpt-j-6b-story-gutenberg-rw-bibliotik-raw':
//     'http://gpt-j-6b-story-gutenberg-rw-bibliotik-raw.tenant-aidungeon.knative.chi.coreweave.com/v1/models/gpt-j-6b:predict',
//   gptjLogits:
//     'http://gpt-j-6b-logits.tenant-aidungeon.knative.chi.coreweave.com/v1/models/gpt-j-6b:predict',
// }

export const gptj = (
  options: ModelCompletionOpts,
  context: CompletionContext
) => {
  const modelEngines: Record<string, string> = {
    gptj: 'gpt-j-6b',
    'gpt-j-6b-story-gutenberg-rw-bibliotik-raw':
      'gpt-j-6b-story-gutenberg-rw-bibliotik-raw',
    gptjLogits: 'gpt-j-6b-logits',
    gptjSummary: 'gptj-summary-large',
    gptjWI: 'gpt-j-6b-wi',
  }
  const engine = modelEngines[options.model]
  if (!engine) throw new CustomError('input-failed', 'Model not supported')
  return modelComplete({ ...options, model: 'gpt-j-6b', engine }, context)
}

export const modelComplete = async (
  options: ModelCompletionOpts,
  context: CompletionContext
) => {
  const t0 = performance.now()

  const [success, response] = await coreweaveComplete({ ...options })
  const t1 = performance.now()
  const durationMs = t1 - t0

  // const responses = response?.predictions ?? []
  // const requestTokenCount =
  //   options.model === 'gpt-j-6b' ? Encoder.encode(options.text).length : null
  // const responseTokenCount =
  //   success && options.model === 'gpt-j-6b'
  //     ? Encoder.encode(responses.join(' ')).length
  //     : null

  // const latitudeApiProductId = process.env.LATITUDE_API_PRODUCT_ID || ''
  // const modelRequest = await eventsDatabase.modelRequests
  //   .create(
  //     {
  //       request: { ...options },
  //       requestTokenCount,
  //       productId: context?.productId ?? latitudeApiProductId,
  //       vendorName: 'coreweave',
  //       vendorModel: options.model,
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
  if (!success) throw new CustomError('coreweave-error', response)
  return success
    ? { ...response, durationMs, /* modelRequestId: modelRequest?.id */ }
    : {}
}

const coreweaveComplete = async (options: ModelCompletionOpts) => {
  const {
    model,
    engine,
    text,
    n,
    topP,
    temperature,
    length,
    repetitionPenalty,
    badWords,
  } = options

  const request = {
    url: `http://${engine}.tenant-aidungeon.knative.chi.coreweave.com/v1/models/${model}:predict`,
    // TODO (mitchg) - callers to LAPI should be able to override this timeout
    timeout: 15000,
    body: {
      text,
      n,
      temperature,
      length,
      top_p: topP,
      repetition_penalty: repetitionPenalty,
      bad_words: badWords,
    },
    json: true,
  }
  try {
    const response = await requestPromise.post(request)
    return [true, response]
  } catch (error) {
    return [false, error.message]
  }
}

type ModelCompletionOpts = {
  model: string
  engine?: string
  text?: string
  n?: number
  temperature?: number
  topP?: number
  length?: number
  repetitionPenalty?: number
  badWords?: string[]
}
