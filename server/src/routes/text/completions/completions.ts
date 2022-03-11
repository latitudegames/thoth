import Koa from 'koa'

import { apiKeyAuth } from '../../../middleware/auth'
import { ai21 } from '../../../routes/vendor/ai21/ai21'
import { gptj } from '../../../routes/vendor/coreweave/coreweave'
import {
  forefront,
  ForefrontCompletionResponse,
} from '../../../routes/vendor/forefront/forefront'
import { huggingface } from '../../../routes/vendor/huggingface/huggingface'
import {
  modelComplete,
  ModelCompletionOpts,
} from '../../../routes/vendor/openai/openai'
import { Route } from '../../../types'
import { CustomError } from '../../../utils/CustomError'
import { CompletionContext } from '../../../utils/modelRequest'
import {
  formatGPTJResponse,
  formatOpenAIResponse,
  formatAi21Response,
  formatForefrontResponse,
  formatHuggingfaceResponse,
  AI21ModelResponse,
  HuggingfaceModelResponse,
} from '../../../utils/UniversalModelResponse'

const defaultOptions = {
  model: 'davinci-cached',
  presencePenalty: 0.0,
  temperature: 0.7,
  maxTokens: 120,
  n: 1,
  logitBias: {},
}

export type CompletionRequest = ModelCompletionOpts & {
  context: CompletionContext
  modelSource: ModelSources
  getFullResponse: boolean
  universalFormat: boolean
}
export const completionsParser = async (
  completionRequest: CompletionRequest
) => {
  const {
    context,
    getFullResponse,
    modelSource = 'openai',
    universalFormat = false,
    ...options
  } = completionRequest
  if (!options) throw new CustomError('input-failed', 'No parameters provided')

  if (!(modelSource in ModelSources))
    throw new CustomError('input-failed', 'Model source not supported')

  switch (modelSource) {
    case ModelSources[ModelSources.openai]:
      try {
        const results = await modelComplete(
          { ...defaultOptions, ...options },
          context
        )
        const firstResult =
          results?.choices?.length > 0 ? results.choices[0].text : ''
        return getFullResponse
          ? universalFormat
            ? formatOpenAIResponse(
              results,
              options?.prompt as string,
              options?.echo
            )
            : results
          : { result: firstResult, durationMs: results.durationMs }
      } catch (err) {
        const msg = err.message
        throw new CustomError('open-ai-error', msg, err)
      }
    case ModelSources[ModelSources.coreweave]:
      if (!process.env.USE_LATITUDE_API || process.env.USE_LATITUDE_API === '') {
        throw new CustomError('input-failed', 'Latitude API not enabled')
      }
      const prediction = await gptj(options, context)
      return universalFormat
        ? formatGPTJResponse(prediction, options?.text as string)
        : prediction
    case ModelSources[ModelSources.ai21]:
      const ai21CompletionResponse = await ai21(options, context)
      return universalFormat
        ? formatAi21Response(
          ai21CompletionResponse as AI21ModelResponse,
          options.model
        )
        : ai21CompletionResponse
    case ModelSources[ModelSources.huggingface]:
      const huggingfaceCompletionResponse = await huggingface({
        model: options.model,
        options,
        context,
      })
      return universalFormat
        ? formatHuggingfaceResponse(
          huggingfaceCompletionResponse as HuggingfaceModelResponse,
          options.model
        )
        : huggingfaceCompletionResponse
    case ModelSources[ModelSources.forefront]:
      const forefrontCompletionResponse = await forefront(options, context)
      return universalFormat
        ? formatForefrontResponse(
          forefrontCompletionResponse as ForefrontCompletionResponse,
          options.model
        )
        : forefrontCompletionResponse
  }
}

const completionsHandler = async (ctx: Koa.Context) => {
  const {
    context,
    getFullResponse,
    modelSource = 'openai',
    ...options
  } = ctx.request.body

  const completion = await completionsParser({
    context,
    getFullResponse,
    modelSource,
    ...options,
  })
  ctx.body = completion
}

export const completions: Route[] = [
  {
    path: '/text/completions',
    access: apiKeyAuth(),
    post: completionsHandler,
  },
  // DEPRECATED
  {
    path: '/ml/text/completions',
    access: apiKeyAuth(),
    post: completionsHandler,
  },
]

enum ModelSources {
  'openai',
  'coreweave',
  'ai21',
  'forefront',
  'huggingface',
}
