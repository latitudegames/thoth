// @ts-nocheck
import { createWikipediaEntity } from '../entities/connectors/wikipedia'
import { database } from '../database'
import { handleInput } from '../entities/connectors/handleInput'
//@ts-ignore
import weaviate from 'weaviate-client'
import Koa from 'koa'
import 'regenerator-runtime/runtime'
import { noAuth } from '../middleware/auth'
import { Route } from '../types'
import axios from 'axios'
import { cacheManager } from '../cacheManager'
import { makeCompletion } from '../utils/MakeCompletionRequest'
import { MakeModelRequest } from '../utils/MakeModelRequest'
import { tts } from '../systems/googleTextToSpeech'
import { getAudioUrl } from './getAudioUrl'

export const modules: Record<string, unknown> = {}

const executeHandler = async (ctx: Koa.Context) => {
  const message = ctx.request.body.command
  const speaker = ctx.request.body.sender
  const agent = ctx.request.body.agent
  const entityId = ctx.request.body.entityId
  const id = ctx.request.body.id
  const msg = 'Hello'
  const spell_handler = ctx.request.body.handler ?? 'default'
  if (message.includes('/become')) {
    let out: any = {}
    if (!(await database.instance.entityExists(agent))) {
      out = await createWikipediaEntity('Speaker', agent, '', '')
    }

    if (out === undefined) {
      out = {}
    }

    out.defaultGreeting = await msg
    database.instance.createEvent(
      'conversation',
      agent,
      'web',
      id,
      agent,
      out.defaultGreeting
    )
    return (ctx.body = out)
  }
  ctx.body = await handleInput(
    message,
    speaker,
    agent,
    'web',
    id,
    spell_handler,
    entityId
  )
}

const getEntitiesHandler = async (ctx: Koa.Context) => {
  try {
    let data = await database.instance.getEntities()
    return (ctx.body = data)
  } catch (e) {
    console.log('getEntitiesHandler:', e)
    ctx.status = 500
    return (ctx.body = { error: 'internal error' })
  }
}

const getEntityHandler = async (ctx: Koa.Context) => {
  try {
    const instanceId = ctx.request.query.instanceId as string
    const isNum = /^\d+$/.test(instanceId)
    const _instanceId = isNum
      ? parseInt(instanceId)
        ? parseInt(instanceId) >= 1
          ? parseInt(instanceId)
          : 1
        : 1
      : 1
    let data = await database.instance.getEntity(_instanceId)
    if (data === undefined || !data) {
      let newId = _instanceId
      while ((await database.instance.entityExists(newId)) || newId <= 0) {
        newId++
      }

      data = {
        id: newId,
        personality: '',
        enabled: true,
      }
    }
    return (ctx.body = data)
  } catch (e) {
    console.log('getEntityHandler:', e)
    ctx.status = 500
    return (ctx.body = { error: 'internal error' })
  }
}

const addEntityHandler = async (ctx: Koa.Context) => {
  const data = ctx.request.body.data
  let instanceId = ctx.request.body.id ?? ctx.request.body.instanceId

  if (!instanceId || instanceId === undefined || instanceId <= 0) {
    instanceId = 0
    while (
      (await database.instance.entityExists(instanceId)) ||
      instanceId <= 0
    ) {
      instanceId++
    }
  }

  try {
    console.log('updated agent database with', data)
    return (ctx.body = await database.instance.updateEntity(instanceId, data))
  } catch (e) {
    console.log('addEntityHandler:', e)
    ctx.status = 500
    return (ctx.body = { error: 'internal error' })
  }
}

const deleteEntityHandler = async (ctx: Koa.Context) => {
  const { id } = ctx.params
  console.log('deleteEntityHandler', deleteEntityHandler)

  try {
    return (ctx.body = await database.instance.deleteEntity(id))
  } catch (e) {
    console.log(e)
    ctx.status = 500
    return (ctx.body = 'internal error')
  }
}

const getEvent = async (ctx: Koa.Context) => {
  const type = ctx.request.query.type as string
  const agent = ctx.request.query.agent
  const speaker = ctx.request.query.speaker
  const client = ctx.request.query.client
  const channel = ctx.request.query.channel
  const maxCount = parseInt(ctx.request.query.maxCount as string)
  const conversation = await database.instance.getEvents(
    type,
    agent,
    speaker,
    client,
    channel,
    true,
    maxCount
  )

  console.log('conversation, query:', ctx.request.query, 'conv:', conversation)

  return (ctx.body = conversation)
}

const getAllEvents = async (ctx: Koa.Context) => {
  try {
    const events = await database.instance.getAllEvents()
    return (ctx.body = events)
  } catch (e) {
    console.log(e)
    ctx.status = 500
    return (ctx.body = 'internal error')
  }
}

const getSortedEventsByDate = async (ctx: Koa.Context) => {
  try {
    const sortOrder = ctx.request.query.order as st
    if(!['asc', 'desc'].includes(sortOrder)) {
      ctx.status = 400
      return (ctx.body = 'invalid sort order')
    }
    const events = await database.instance.getSortedEventsByDate(sortOrder)
    return (ctx.body = events)
  } catch (e) {
    console.log(e)
    ctx.status = 500
    return (ctx.body = 'internal error')
  }
}

const deleteEvent = async (ctx: Koa.Context) => {
  try {
    const { id } = ctx.params
    if(!parseInt(id)) {
      ctx.status = 400
      return (ctx.body = 'invalid url parameter')
    }
    const res = await database.instance.deleteEvent(id)
    return (ctx.body = res.rowCount)
  } catch (e) {
    console.log(e)
    ctx.status = 500
    return (ctx.body = 'internal error')
  }
}

const updateEvent = async (ctx: Koa.Context) => {
  try {
    const { id } = ctx.params
    if(!parseInt(id)) {
      ctx.status = 400
      return (ctx.body = 'invalid url parameter')
    }

    const agent = ctx.request.body.agent
    const sender = ctx.request.body.sender
    const client = ctx.request.body.client
    const channel = ctx.request.body.channel
    const text = ctx.request.body.text
    const type = ctx.request.body.type
    const date = ctx.request.body.date

    const res = await database.instance.updateEvent(id, { agent, sender, client, channel, text, type, date })
    return (ctx.body = res)
  } catch (e) {
    console.log(e)
    ctx.status = 500
    return (ctx.body = 'internal error')
  }
}

const createEvent = async (ctx: Koa.Context) => {
  const agent = ctx.request.body.agent
  const speaker = ctx.request.body.speaker
  const client = ctx.request.body.client
  const channel = ctx.request.body.channel
  const text = ctx.request.body.text
  const type = ctx.request.body.type
  console.log('Creating event:', agent, speaker, client, channel, text, type)
  await database.instance.createEvent(
    type,
    agent,
    client,
    channel,
    speaker,
    text
  )

  return (ctx.body = 'ok')
}

const getSpeechToText = async (ctx: Koa.Context) => {
  const text = ctx.request.query.text
  const character = ctx.request.query.character ?? 'none'
  console.log("text and character are", text, character)
  const cache = await cacheManager.instance.get(
    character as string,
    'speech_' + character + ': ' + text,
    true
  )
  if (cache !== undefined && cache !== null) {
    console.log('got sst from cache, cache:', cache)
    return (ctx.body = cache)
  }

  // const fileId = await tts(text as string)
  // const url =
  //   (process.env.FILE_SERVER_URL?.endsWith('/')
  //     ? process.env.FILE_SERVER_URL
  //     : process.env.FILE_SERVER_URL + '/') + fileId

  const url = await getAudioUrl(
    process.env.UBER_DUCK_KEY as string,
    process.env.UBER_DUCK_SECRET_KEY as string,
    character as string,
    text as string
  )
  console.log('stt url:', url)

  cacheManager.instance.set('global', 'speech_' + character + ': ' + text, url)

  return (ctx.body = url)
}

const getEntityImage = async (ctx: Koa.Context) => {
  const agent = ctx.request.query.agent

  const resp = await axios.get(
    `https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&prop=pageimages&piprop=original&titles=${agent}`
  )

  if (
    resp.data.query.pages &&
    resp.data.query.pages.length > 0 &&
    resp.data.query.pages[0].original
  ) {
    return (ctx.body = resp.data.query.pages[0].original.source)
  }

  return (ctx.body = '')
}

const customMessage = async (ctx: Koa.Context) => {
  const sender = ctx.request.body?.sender as string
  const agent = ctx.request.body?.agent as string
  const message = (ctx.request.body?.message as string).trim().toLowerCase()
  let isVoice = ctx.request.body?.isVoice as boolean
  let url: any = ''
  let response = message

  if (message.startsWith('[welcome]')) {
    const user = message.replace('[welcome]', '').trim()
    response = 'Welcome ' + user + '!'
    isVoice = true
  }
  let cmd = message.trim().toLowerCase()

  if (cmd.length <= 0) {
    response = "I can't understand you!"
  } else if (cmd === 'play') {
  } else if (cmd === 'pause') {
  } else if (cmd.startsWith('go to')) {
  } else {
    response = await requestInformationAboutVideo(sender, agent, cmd)
  }

  if (isVoice) {
    console.log('generating voice')
    const character = 'kurzgesagt'
    const cache = cacheManager.instance.get(
      'global',
      'speech_' + character + ': ' + response,
      true
    )
    if (cache !== undefined && cache !== null) {
      return (ctx.body = cache)
    }

    url = await getAudioUrl(
      process.env.UBER_DUCK_KEY as string,
      process.env.UBER_DUCK_SECRET_KEY as string,
      character as string,
      response as string
    )

    cacheManager.instance.set(
      'global',
      'speech_' + character + ': ' + response,
      url
    )
  }

  return (ctx.body = { response: isVoice ? url : message, isVoice: isVoice })
}

const getFromCache = async (ctx: Koa.Context) => {
  const key = ctx.request.query.key as string
  const agent = ctx.request.query.agent as string
  const strict = ctx.request.query.strict as string

  const value = cacheManager.instance.get(agent, key, strict === 'true')
  return (ctx.body = { data: value })
}

const deleteFromCache = async (ctx: Koa.Context) => {
  const key = ctx.request.query.key as string
  const agent = ctx.request.query.agent as string

  cacheManager.instance._delete(agent, key)
  return (ctx.body = 'ok')
}

const setInCache = async (ctx: Koa.Context) => {
  const key = ctx.request.body.key as string
  const agent = ctx.request.body.agent as string
  const value = ctx.request.body.value

  cacheManager.instance.set(agent, key, value)
  return (ctx.body = 'ok')
}

const textCompletion = async (ctx: Koa.Context) => {
  const prompt = ctx.request.body.prompt as string
  const modelName = ctx.request.body.modelName as string
  const temperature = ctx.request.body.temperature as number
  const maxTokens = ctx.request.body.maxTokens as number
  const topP = ctx.request.body.topP as number
  const frequencyPenalty = ctx.request.body.frequencyPenalty as number
  const presencePenalty = ctx.request.body.presencePenalty as number
  const sender = (ctx.request.body.sender as string) ?? 'User'
  let stop = ctx.request.body.stop as string[]

  if (!stop || stop.length === undefined || stop.length <= 0) {
    stop = ['"""', `${sender}:`, '\n']
  } else {
    for (let i = 0; i < stop.length; i++) {
      if (stop[i] === '#speaker:') {
        stop[i] = `${sender}:`
      }
    }
  }

  const { success, choice } = await makeCompletion(modelName, {
    prompt: prompt,
    temperature: temperature,
    max_tokens: maxTokens,
    top_p: topP,
    frequency_penalty: frequencyPenalty,
    presence_penalty: presencePenalty,
    stop: stop,
  })

  return (ctx.body = { success, choice })
}

const hfRequest = async (ctx: Koa.Context) => {
  const inputs = ctx.request.body.inputs as string
  const model = ctx.request.body.model as string
  const parameters = ctx.request.body.parameters as any
  const options = (ctx.request.body.options as any) || {
    use_cache: false,
    wait_for_model: true,
  }

  const { success, data } = await MakeModelRequest(
    inputs,
    model,
    parameters,
    options
  )

  return (ctx.body = { success, data })
}

const makeWeaviateRequest = async (ctx: Koa.Context) => {
  const keyword = ctx.request.body.keyword as string

  const client = weaviate.client({
    scheme: 'http',
    host: 'semantic-search-wikipedia-with-weaviate.api.vectors.network:8080/',
  })

  const res = await client.graphql
    .get()
    .withNearText({
      concepts: [keyword],
      certainty: 0.75,
    })
    .withClassName('Paragraph')
    .withFields('title content inArticle { ... on Article {  title } }')
    .withLimit(3)
    .do()

  if (res.data.Get !== undefined) {
    return (ctx.body = { data: res.data.Get })
  }
  return (ctx.body = { data: '' })
}

const getEntityData = async (ctx: Koa.Context) => {
  const agent = ctx.request.query.agent as string

  const data = await database.instance.getEntity(agent)

  return (ctx.body = { agent: data })
}

const requestInformationAboutVideo = async (
  sender: string,
  agent: string,
  question: string
): Promise<string> => {
  const videoInformation = ``
  const prompt = `Information: ${videoInformation} \n ${sender}: ${question.trim().endsWith('?') ? question.trim() : question.trim() + '?'
    }\n${agent}:`

  const modelName = 'davinci'
  const temperature = 0.9
  const maxTokens = 100
  const topP = 1
  const frequencyPenalty = 0.5
  const presencePenalty = 0.5
  const stop: string[] = ['"""', `${sender}:`, '\n']

  const { success, choice } = await makeCompletion(modelName, {
    prompt: prompt,
    temperature: temperature,
    max_tokens: maxTokens,
    top_p: topP,
    frequency_penalty: frequencyPenalty,
    presence_penalty: presencePenalty,
    stop: stop,
  })

  return success ? choice : "Sorry I can't answer your question!"
}

const chatEntity = async (ctx: Koa.Context) => {
  const speaker = ctx.request.body.speaker as string
  const agent = ctx.request?.body?.agent as string

  const personality = ''
  const facts = ''
  let out = undefined

  if (!(await database.instance.entityExists(agent))) {
    out = await createWikipediaEntity(speaker, agent, personality, facts)
  }

  if (out === undefined) {
    out = {}
  }

  return (ctx.body = out)
}

const getEntitiesInfo = async (ctx: Koa.Context) => {
  const id = (ctx.request.query.id as string)
    ? parseInt(ctx.request.query.id as string)
    : -1

  try {
    let data = await database.instance.getEntities()
    let info = undefined
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        info = data[i]
      }
    }

    return (ctx.body = info)
  } catch (e) {
    console.log('getEntitiesHandler:', e)
    ctx.status = 500
    return (ctx.body = { error: 'internal error' })
  }
}

const handleCustomInput = async (ctx: Koa.Context) => {
  const message = ctx.request.body.message as string
  const speaker = ctx.request.body.sender as string
  const agent = ctx.request.body.agent as string
  const client = ctx.request.body.client as string
  const channelId = ctx.request.body.channelId as string

  return (ctx.body = {
    response: handleInput(
      message,
      speaker,
      agent,
      client,
      channelId,
      1,
      'default',
      'latest'
    ),
  })
}

export const entities: Route[] = [
  {
    path: '/execute',
    access: noAuth,
    post: executeHandler,
  },
  {
    path: '/entities',
    access: noAuth,
    get: getEntitiesHandler,
  },
  {
    path: '/entity',
    access: noAuth,
    get: getEntityHandler,
    post: addEntityHandler,
  },
  {
    path: '/entity/:id',
    access: noAuth,
    delete: deleteEntityHandler,
  },
  {
    path: '/event',
    access: noAuth,
    get: getEvent,
    post: createEvent,
  },
  {
    path: '/event/:id',
    access: noAuth,
    delete: deleteEvent,
    put: updateEvent,
  },
  {
    path: '/events',
    access: noAuth,
    get: getAllEvents,
  },
  {
    path: '/events_sorted',
    access: noAuth,
    get: getSortedEventsByDate,
  },
  {
    path: '/speech_to_text',
    access: noAuth,
    get: getSpeechToText,
  },
  {
    path: '/get_entity_image',
    access: noAuth,
    get: getEntityImage,
  },
  {
    path: '/cache_manager',
    access: noAuth,
    get: getFromCache,
    delete: deleteFromCache,
    post: setInCache,
  },
  {
    path: '/text_completion',
    access: noAuth,
    post: textCompletion,
  },
  {
    path: '/hf_request',
    access: noAuth,
    post: hfRequest,
  },
  {
    path: '/weaviate',
    access: noAuth,
    post: makeWeaviateRequest,
  },
  {
    path: '/custom_message',
    access: noAuth,
    post: customMessage,
  },
  {
    path: '/chat_agent',
    access: noAuth,
    post: chatEntity,
  },
  {
    path: '/entities_info',
    access: noAuth,
    get: getEntitiesInfo,
  },
  {
    path: '/handle_custom_input',
    access: noAuth,
    post: handleCustomInput,
  },
]
