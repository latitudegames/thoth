/* eslint-disable no-console */
import { encode } from 'gpt-3-encoder'
import Koa from 'koa'

import { creatorToolsDatabase } from '../../databases/creatorTools'
import { apiKeyWithAccess } from '../../middleware/auth'
import { Route } from '../../types'
import { CustomError } from '../../utils/CustomError'
import { CompletionContext } from '../../utils/modelRequest'
import { ModelCompletionOpts, modelComplete } from '../vendor/openai/openai'
import { getPrompt, getPreamble, extractOutput } from './fewshotHelper'

const enkiProductId = 'c8610408-df83-4388-a968-071aa2bfe2bb'

const defaultOptions = {
  model: 'davinci-cached',
  presencePenalty: 0.0,
  temperature: 0.7,
  maxTokens: 120,
  n: 1,
  logitBias: {},
  topP: 1,
}

const getEnki = async (ctx: Koa.Context) => {
  const enkiTasks = await creatorToolsDatabase.fewshotTask.findAll({
    limit: 100,
  })
  ctx.body = { enkiTasks }
}

const getEnkis = async (ctx: Koa.Context) => {
  const name = ctx.params.name
  const fewshotTask = await creatorToolsDatabase.fewshotTask.findOne({
    where: { name },
  })
  if (!fewshotTask)
    throw new CustomError('input-failed', 'fewshot task not found')

  const dataPoints = parseInt(`${ctx.query.dataPoints}`)
  const fewshotTaskId = Number(fewshotTask.id)
  const fewshotData = await creatorToolsDatabase.fewshotData.findAll({
    where: { fewshotTaskId },
    limit: isNaN(dataPoints) ? 10 : dataPoints,
  })
  if (!fewshotData)
    throw new CustomError('input-failed', 'fewshot data not found')
  const fewshotSerialization =
    await creatorToolsDatabase.fewshotSerialization.findOne({
      where: { fewshotTaskId },
    })
  if (!fewshotSerialization)
    throw new CustomError('input-failed', 'fewshot serialization not found')

  ctx.body =
    ctx.query.stringOutput === 'true'
      ? { preamble: getPreamble(fewshotData, fewshotSerialization) }
      : {
        task: fewshotTask,
        data: fewshotData,
        serialization: fewshotSerialization,
      }
}

export const getEnkiOutputs = async (
  ctx: Koa.Context,
  taskName?: string,
  directInputs?: string
) => {
  const {
    inputs: requestInputs,
    numSamples,
    temperature = 0.8,
    maxTokens = 256,
    preferredWords = [],
    preferenceStrength = 50,
    antipreferredWords = [],
    antipreferenceStrength = 50,
    dataPoints = 10,
    fewshotData = [],
  } = ctx.request.body
  const fewshotTaskName = taskName ? taskName : ctx.params.name
  const inputs = directInputs ? directInputs : requestInputs
  if (!inputs)
    throw new CustomError('input-failed', 'fewshot task inputs required')

  const fewshotTask = await creatorToolsDatabase.fewshotTask.findOne({
    where: { name: fewshotTaskName },
  })
  if (!fewshotTask) throw new CustomError('not-found', 'no fewshot task found')

  const { id: fewshotTaskId, numInputs, name } = fewshotTask
  if (inputs?.length !== numInputs) {
    throw new CustomError(
      'input-failed',
      `Fewshot Task "${name}" requires an array of ${numInputs} inputs`
    )
  }
  // eslint-disable-next-line functional/no-let
  let enkiFewshotData

  if (fewshotData.length > 0) {
    enkiFewshotData = fewshotData
  } else {
    enkiFewshotData = await creatorToolsDatabase.fewshotData.findAll({
      where: { fewshotTaskId: Number(fewshotTaskId) },
      limit: dataPoints,
    })
  }
  const serialization = await creatorToolsDatabase.fewshotSerialization.findOne(
    {
      where: { fewshotTaskId },
    }
  )
  if (!serialization)
    throw new CustomError('input-failed', 'fewshot serialization not found')

  const prompt = getPrompt(inputs, enkiFewshotData, serialization)
  const noTrailingWhitespace = prompt.trimRight()
  const whitespacePrefix = prompt.slice(noTrailingWhitespace.length)

  // Original code comes from latitudegames/enki/blob/main/resolvers/TextContinuation.ts#L34
  const stop = serialization?.atTheEnd || ''
  const preferredTokens = new Set(
    preferredWords.flatMap((s: string) => encode(s))
  )
  const antipreferredTokens = new Set(
    antipreferredWords.flatMap((s: string) => encode(s))
  )

  const preferredLogitBiases = new Map<string, number>(
    [...preferredTokens]
      .filter((x: string) => !antipreferredTokens.has(x))
      .map((x: string) => [x, preferenceStrength])
  )

  const antiPreferredLogitBiases = new Map<string, number>(
    [...antipreferredTokens]
      .filter((x: string) => !preferredTokens.has(x))
      .map((x: string) => [x, -antipreferenceStrength])
  )

  const logitBiases: { [string: string]: number } = {}
  // eslint-disable-next-line functional/no-loop-statement
  for (const x of preferredLogitBiases.entries()) {
    // eslint-disable-next-line functional/immutable-data
    logitBiases[x[0]] = x[1]
  }
  // eslint-disable-next-line functional/no-loop-statement
  for (const x of antiPreferredLogitBiases.entries()) {
    // eslint-disable-next-line functional/immutable-data
    logitBiases[x[0]] = x[1]
  }
  const uselogitBiases = Object.keys(logitBiases).length
    ? logitBiases
    : undefined
  const actualStop = [...stop].every(x => x === '\n') ? '' : stop

  const result = await enkiComplete({
    options: {
      ...defaultOptions,
      prompt: noTrailingWhitespace,
      maxTokens,
      logitBias: uselogitBiases,
      n: numSamples,
      temperature: temperature,
      stop: [actualStop],
    },
    context: { productTaskName: fewshotTaskName },
    decideResult: results => results,
  })

  const response =
    result.length > 0
      ? {
        outputs: result.slice(0, numSamples),
      }
      : ''
  // eslint-disable-next-line  functional/no-let
  let outputData: string[] = []
  if (response !== '' && response.outputs) {
    if (whitespacePrefix.length) {
      outputData = response.outputs.filter(
        (x: string) => x.indexOf(whitespacePrefix) === 0
      )
    }
    outputData = response.outputs?.map((x: string) => {
      return x.slice(whitespacePrefix.length) + stop
    })
  }
  // eslint-disable-next-line  functional/no-let
  let extractedOutputs: string[] = []
  if (outputData.length) {
    // eslint-disable-next-line  functional/no-loop-statement
    for (const output of outputData) {
      const extractedResult = extractOutput({
        text: output,
        serialization: serialization,
      })
      if (extractedResult) {
        extractedOutputs = [...extractedOutputs, ...extractedResult]
      }
    }
  }
  return extractedOutputs
}

const getEnkiCompletion = async (ctx: Koa.Context) => {
  const extractedOutputs = await getEnkiOutputs(ctx)
  ctx.body = { outputs: extractedOutputs }
}

export const enki: Route[] = [
  {
    path: '/enki',
    access: apiKeyWithAccess(['internal']),
    get: getEnki,
  },
  {
    path: '/enki/:name',
    access: apiKeyWithAccess(['internal']),
    get: getEnkis,
  },
  {
    path: '/enki/:name/completion',
    access: apiKeyWithAccess(['internal']),
    post: getEnkiCompletion,
  },
]

type enkiCompleteParams = {
  options: ModelCompletionOpts
  context: CompletionContext
  decideResult: (result: string[]) => string[]
}

const enkiComplete = async ({
  options,
  context,
  decideResult,
}: enkiCompleteParams) => {
  const response = await modelComplete(options, {
    productId: enkiProductId,
    ...context,
  }).catch((error: any) => {
    console.log('OPEN AI ERROR!', error)
    throw new CustomError('open-ai-error', error.message, error)
  })
  const result = response.choices?.map((x: { text: string }) => x.text) || []
  console.log('Raw result', result)
  const pickedResult = decideResult(result)
  console.log('Picked result', pickedResult)
  return pickedResult
}
