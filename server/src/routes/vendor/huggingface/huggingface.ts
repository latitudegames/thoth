// import Encoder from 'gpt-3-encoder'
import { performance } from 'perf_hooks'
import requestPromise from 'request-promise'

// import { eventsDatabase } from './../../../databases/events'
import { CustomError } from './../../../utils/CustomError'

const HUGGINGFACE_KEY = process.env.HUGGINGFACE_KEY

export const huggingface = async ({
  context,
  model,
  options,
}: {
  context: any
  model: string
  options: any
}) => {
  const request = {
    headers: { Authorization: `Bearer ${HUGGINGFACE_KEY}` },
    url: `https://api-inference.huggingface.co/models/${model}`,
    body: JSON.stringify(options),
    json: true,
  }
  const t0 = performance.now()

  const response = await requestPromise.post(request)
  const success = !!response
  const t1 = performance.now()
  const durationMs = t1 - t0

  // const responses =
  //   response?.choices?.map((v: { text: string }) => v.text) ?? []
  // const requestTokenCount = Encoder.encode(
  //   options?.text || options?.inputs
  // ).length
  // const responseTokenCount = success
  //   ? Encoder.encode(responses.join(' ')).length
  //   : null

  // const latitudeApiProductId = process.env.LATITUDE_API_PRODUCT_ID || ''
  // const modelRequest = await eventsDatabase.modelRequests
  //   .create(
  //     {
  //       request,
  //       requestTokenCount,
  //       productId: latitudeApiProductId,
  //       vendorName: 'huggingface',
  //       vendorModel: model,
  //       vendorEngine: model,
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
  if (!success) throw new CustomError('generation-model-error', response)
  return success
    ? { ...response, durationMs, /* modelRequestId: modelRequest?.id */ }
    : {}
  // return response
}
