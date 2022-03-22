import { createWikipediaAgent } from '@latitudegames/thoth-core/src/connectors/wikipedia'
import { database } from '@latitudegames/thoth-core/src/connectors/database'
import { handleInput } from '@latitudegames/thoth-core/src/connectors/handleInput'
//@ts-ignore
import weaviate from 'weaviate-client'
import Koa from 'koa'
import 'regenerator-runtime/runtime'
import { noAuth } from '../middleware/auth'
import { Route } from '../types'
import axios from 'axios'
import request from 'request'
import fetch from 'node-fetch'
import { cacheManager } from '../cacheManager'
import { makeCompletion } from '../utils/makeCompletionRequest'
import { makeModelRequest } from '../utils/makeModelRequest'

export const modules: Record<string, unknown> = {}

const getAgentsHandler = async (ctx: Koa.Context) => {
  const agents = await database.instance.getAgents()
  ctx.body = agents
}

const getAgentHandler = async (ctx: Koa.Context) => {
  const agent = await database.instance.getAgent(ctx.query.agent as string)
  if (agent == null) {
    return {}
  }

  ctx.body = agent
}

const createOrUpdateAgentHandler = async (ctx: Koa.Context) => {
  const { agent, data } = ctx.request.body
  if (!agent || agent == undefined || agent.length <= 0) {
    ctx.status = 404
    return (ctx.body = { error: 'invalid agent name' })
  }

  const agentExists = await database.instance.getAgentExists(agent)
  if (!agentExists) {
    await database.instance.createAgent(agent)
  }
  // TODO: Combine all of these!
  try {
    await database.instance.updateAgent(agent, {
      dialog: data.dialog,
      morals: data.morals,
      facts: data.facts,
      monologue: data.monologue,
      personality: data.personality,
      greetings: data.greetings,
    })
  } catch (e) {
    console.log('createOrUpdateAgentHandler:', e)
    ctx.status = 500
    return (ctx.body = { error: 'internal error' })
  }

  ctx.body = 'ok'
}

const deleteAgentHandler = async (ctx: Koa.Context) => {
  console.log('params is', ctx.params)
  const { id } = ctx.params
  return (ctx.body = await database.instance.deleteAgent(id))
}

const getConfigHandler = async (ctx: Koa.Context) => {
  return (ctx.body = await database.instance.getConfig())
}

const addConfigHandler = async (ctx: Koa.Context) => {
  const data = ctx.request.body.data

  try {
    await database.instance.setConfig(data.key, data.value)
    ctx.body = 'ok'
  } catch (e) {
    console.log('addConfigHandler:', e)
    ctx.status = 500
    return (ctx.body = { error: 'internal error' })
  }
}

const updateConfigHandler = async (ctx: Koa.Context) => {
  console.log('updateConfigHandler', ctx.request.body)
  const data = ctx.request.body.config
  try {
    // TODO: build string and set multiple configs at once
    for (let i = 0; i < data.length; i++) {
      await database.instance.setConfig(data[i].key, data[i].value)
    }

    ctx.body = 'ok'
  } catch (e) {
    console.log('updateConfigHandler:', e)
    ctx.status = 500
    return (ctx.body = { error: 'internal error' })
  }
}

const deleteConfigHandler = async (ctx: Koa.Context) => {
  const { id } = ctx.params
  console.log('delete data is ', id)
  try {
    await database.instance.deleteConfig(id)
    ctx.body = 'ok'
  } catch (e) {
    console.log('deleteConfigHandler:', e)
    ctx.status = 500
    return (ctx.body = { error: 'internal error' })
  }
}

const executeHandler = async (ctx: Koa.Context) => {
  const message = ctx.request.body.command
  const speaker = ctx.request.body.sender
  const agent = ctx.request.body.agent
  const entityId = ctx.request.body.entityId
  const id = ctx.request.body.id
  const msg = database.instance.getRandomGreeting(agent)
  const spell_handler = ctx.request.body.handler ?? 'default'
  if (message.includes('/become')) {
    let out: any = {}
    if (!(await database.instance.getAgentExists(agent))) {
      out = await createWikipediaAgent('Speaker', agent, '', '')
    }

    if (out === undefined) {
      out = {}
    }

    out.defaultGreeting = await msg
    database.instance.setConversation(
      agent,
      'web',
      id,
      agent,
      out.defaultGreeting,
      false
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

const getPromptsHandler = async (ctx: Koa.Context) => {
  const config = (await database.instance.getConfig()) as any
  try {
    const data = {
      xr_world: config['xr_world'],
      fact: config['fact_summarization'],
      opinion: config['opinion_summarization'],
      xr: config['xr_room'],
    }

    return (ctx.body = data)
  } catch (e) {
    console.log('getPromptsHandler:', e)
    ctx.status = 500
    return (ctx.body = { error: 'internal error' })
  }
}

const addPromptsHandler = async (ctx: Koa.Context) => {
  const data = ctx.request.body.data
  console.log('addPromptsHandler', ctx.request.body)

  try {
    // TODO: Combine me!
    await database.instance.setConfig('xr_world', data.xr_world)
    // await database.instance.setConfig('fact_summarization', data.fact)
    // await database.instance.setConfig('opinion', data.opinion)
    // await database.instance.setConfig('xr_room', data.xr_world)

    return (ctx.body = 'ok')
  } catch (e) {
    console.log('addPromptsHandler:', e)
    ctx.status = 500
    return (ctx.body = { error: 'internal error' })
  }
}

const getAgentInstancesHandler = async (ctx: Koa.Context) => {
  try {
    let data = await database.instance.getAgentInstances()
    return (ctx.body = data)
  } catch (e) {
    console.log('getAgentInstancesHandler:', e)
    ctx.status = 500
    return (ctx.body = { error: 'internal error' })
  }
}

const getAgentInstanceHandler = async (ctx: Koa.Context) => {
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
    let data = await database.instance.getAgentInstance(_instanceId)
    if (data === undefined || !data) {
      let newId = _instanceId
      while ((await database.instance.instanceIdExists(newId)) || newId <= 0) {
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
    console.log('getAgentInstanceHandler:', e)
    ctx.status = 500
    return (ctx.body = { error: 'internal error' })
  }
}

const addAgentInstanceHandler = async (ctx: Koa.Context) => {
  const data = ctx.request.body.data
  let instanceId = ctx.request.body.id ?? ctx.request.body.instanceId

  if (!instanceId || instanceId === undefined || instanceId <= 0) {
    instanceId = 0
    while (
      (await database.instance.instanceIdExists(instanceId)) ||
      instanceId <= 0
    ) {
      instanceId++
    }
  }

  try {
    console.log('updated agent database with', data)
    return (ctx.body = await database.instance.updateAgentInstances(
      instanceId,
      data
    ))
  } catch (e) {
    console.log('addAgentInstanceHandler:', e)
    ctx.status = 500
    return (ctx.body = { error: 'internal error' })
  }
}

const deleteAgentInstanceHandler = async (ctx: Koa.Context) => {
  const { id } = ctx.params
  console.log('deleteAgentInstanceHandler', deleteAgentInstanceHandler)
  ctx.body = await database.instance.deleteAgentInstance(id)
}

const setFacts = async (ctx: Koa.Context) => {
  const { agent, speaker, facts } = ctx.request.body

  await database.instance.setSpeakersFacts(agent, speaker, facts)

  return (ctx.body = 'ok')
}
const getFacts = async (ctx: Koa.Context) => {
  const agent = ctx.request.query.agent
  const speaker = ctx.request.query.speaker

  try {
    const facts = await database.instance.getSpeakersFacts(
      agent,
      speaker,
      false
    )
    return (ctx.body = facts)
  } catch (e) {
    return (ctx.body = '')
  }
}
const getFactsCount = async (ctx: Koa.Context) => {
  const agent = ctx.request.query.agent
  const speaker = ctx.request.query.speaker

  try {
    const facts = await database.instance.getSpeakersFacts(
      agent,
      speaker,
      false
    )
    return (ctx.body = facts.length)
  } catch (e) {
    return (ctx.body = 0)
  }
}

const getConversation = async (ctx: Koa.Context) => {
  const agent = ctx.request.query.agent
  const speaker = ctx.request.query.speaker
  const client = ctx.request.query.client
  const channel = ctx.request.query.channel
  const maxCount = parseInt(ctx.request.query.maxCount as string)

  const conversation = await database.instance.getConversation(
    agent,
    speaker,
    client,
    channel,
    false,
    true,
    maxCount
  )

  console.log('conversation, query:', ctx.request.query, 'conv:', conversation)

  return (ctx.body = conversation)
}
const setConversation = async (ctx: Koa.Context) => {
  const agent = ctx.request.body.agent
  const speaker = ctx.request.body.speaker
  const client = ctx.request.body.client
  const channel = ctx.request.body.channel
  const conversation = ctx.request.body.conv

  await database.instance.setConversation(
    agent,
    client,
    channel,
    speaker,
    conversation,
    false
  )

  return (ctx.body = 'ok')
}
const getConversationCount = async (ctx: Koa.Context) => {
  const agent = ctx.request.query.agent
  const speaker = ctx.request.query.speaker
  const client = ctx.request.query.client
  const channel = ctx.request.query.channel

  const conversation = await database.instance.getConversation(
    agent,
    speaker,
    client,
    channel,
    false
  )
  console.log(
    'got conversation for query:',
    ctx.request.query.agent,
    'data:',
    conversation
  )

  return (ctx.body = conversation.length)
}
const archiveConversation = async (ctx: Koa.Context) => {
  const agent = ctx.request.body.agent
  const speaker = ctx.request.body.speaker
  const client = ctx.request.body.client
  const channel = ctx.request.body.channel

  await database.instance.archiveConversation(agent, client, channel, speaker)
  return (ctx.body = 'ok')
}

const getRelationshipMatrix = async (ctx: Koa.Context) => {
  const agent = ctx.request.query.agent
  const speaker = ctx.request.query.speaker

  try {
    const matrix = database.instance.getRelationshipMatrix(speaker, agent)
    return (ctx.body = matrix)
  } catch (e) {
    console.log('getRelationshipMatrix:', e)
    ctx.status = 500
    return (ctx.body = { error: 'internal error' })
  }
}
const setRelationshipMatrix = async (ctx: Koa.Context) => {
  const agent = ctx.request.body.agent
  const speaker = ctx.request.body.speaker
  const matrix = ctx.request.body.matrix

  try {
    database.instance.setRelationshipMatrix(speaker, agent, matrix)
    return (ctx.body = 'ok')
  } catch (e) {
    console.log('setRelationshipMatrix:', e)
    ctx.status = 500
    return (ctx.body = { error: 'internal error' })
  }
}
const getSpeechToText = async (ctx: Koa.Context) => {
  const text = ctx.request.query.text
  const character = ctx.request.query.character
  const cache = cacheManager.instance.get(
    'global',
    'speech_' + character + ': ' + text
  )
  if (cache !== undefined && cache !== null) {
    return (ctx.body = cache)
  }

  const url = await getAudioUrl(
    process.env.UBER_DUCK_KEY as string,
    process.env.UBER_DUCK_SECRET_KEY as string,
    character as string,
    text as string
  )

  cacheManager.instance.set('global', 'speech_' + character + ': ' + text, url)

  return (ctx.body = url)
}

function getAudioUrl(
  key: string,
  secretKey: string,
  carachter: string,
  text: string
) {
  if (carachter === undefined) throw new Error('Define the carachter voice.')
  if (key === undefined) throw new Error('Define the key you got from uberduck')
  if (carachter === undefined)
    throw new Error('Define the secret key u got from uberduck.')

  return new Promise(async (resolve, reject) => {
    await request(
      {
        url: 'https://api.uberduck.ai/speak',
        method: 'POST',
        body: `{"speech": "${text}","voice": "${carachter}"}`,
        auth: {
          user: key,
          pass: secretKey,
        },
      },
      async (erro: any, response: any, body: any) => {
        if (erro)
          throw new Error(
            'Error when making request, verify if yours params (key, secretKey, carachter) are correct.'
          )
        const audioResponse: string =
          'https://api.uberduck.ai/speak-status?uuid=' + JSON.parse(body).uuid
        let jsonResponse: any = false
        async function getJson(url: string) {
          let jsonResult: any = undefined
          await fetch(url)
            .then(res => res.json())
            .then(json => {
              jsonResult = json
            })
          return jsonResult
        }

        jsonResponse = await getJson(audioResponse)
        while (jsonResponse.path === null)
          jsonResponse = await getJson(audioResponse)

        resolve(jsonResponse.path)
      }
    )
  })
}

const getAgentImage = async (ctx: Koa.Context) => {
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
      'speech_' + character + ': ' + response
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

  const value = cacheManager.instance.get(agent, key)
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

  const { success, data } = await makeModelRequest(
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

const getAgentData = async (ctx: Koa.Context) => {
  const agent = ctx.request.query.agent as string

  const data = await database.instance.getAgent(agent)

  return (ctx.body = { agent: data })
}

const getAgentFacts = async (ctx: Koa.Context) => {
  const agent = ctx.request.query.agent as string

  try {
    const data = await database.instance.getAgentFacts(agent)
    return (ctx.body = { facts: data })
  } catch (e) {
    return (ctx.body = { facts: '' })
  }
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

const getPersonalities = async (ctx: Koa.Context) => {
  const agents = await database.instance.getAgents()
  const res: string[] = []

  for (let i = 0; i < agents.length; i++) {
    res.push(agents[i].agent)
  }

  return (ctx.body = { personalities: res })
}

const chatAgent = async (ctx: Koa.Context) => {
  const speaker = ctx.request.body.speaker as string
  const agent = ctx.request?.body?.agent as string

  const personality = ''
  const facts = ''
  let out = undefined

  if (!(await database.instance.getAgentExists(agent))) {
    out = await createWikipediaAgent(speaker, agent, personality, facts)
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
    let data = await database.instance.getAgentInstances()
    let info = undefined
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        info = data[i]
      }
    }

    return (ctx.body = info)
  } catch (e) {
    console.log('getAgentInstancesHandler:', e)
    ctx.status = 500
    return (ctx.body = { error: 'internal error' })
  }
}

export const agents: Route[] = [
  {
    path: '/agents',
    access: noAuth,
    get: getAgentsHandler,
  },

  {
    path: '/agent',
    access: noAuth,
    get: getAgentHandler,
    post: createOrUpdateAgentHandler,
    delete: deleteAgentHandler,
  },
  {
    path: '/agent/:id',
    access: noAuth,
    delete: deleteAgentHandler,
  },
  {
    path: '/config',
    access: noAuth,
    get: getConfigHandler,
    post: addConfigHandler,
    put: updateConfigHandler,
  },
  {
    path: '/config/:id',
    access: noAuth,
    delete: deleteConfigHandler,
  },
  {
    path: '/prompts',
    access: noAuth,
    get: getPromptsHandler,
    post: addPromptsHandler,
  },
  {
    path: '/execute',
    access: noAuth,
    post: executeHandler,
  },
  {
    path: '/agentInstances',
    access: noAuth,
    get: getAgentInstancesHandler,
  },
  {
    path: '/agentInstance',
    access: noAuth,
    get: getAgentInstanceHandler,
    post: addAgentInstanceHandler,
  },
  {
    path: '/agentInstance/:id',
    access: noAuth,
    delete: deleteAgentInstanceHandler,
  },
  {
    path: '/facts',
    access: noAuth,
    get: getFacts,
    post: setFacts,
  },
  {
    path: '/facts_count',
    access: noAuth,
    get: getFactsCount,
  },
  {
    path: '/conversation',
    access: noAuth,
    get: getConversation,
    post: setConversation,
  },
  {
    path: '/conversation_count',
    access: noAuth,
    get: getConversationCount,
  },
  {
    path: '/archiveConversation',
    access: noAuth,
    post: archiveConversation,
  },
  {
    path: '/relationship_matrix',
    access: noAuth,
    get: getRelationshipMatrix,
    post: setRelationshipMatrix,
  },
  {
    path: '/speech_to_text',
    access: noAuth,
    get: getSpeechToText,
  },
  {
    path: '/get_agent_image',
    access: noAuth,
    get: getAgentImage,
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
    path: '/agent_data',
    access: noAuth,
    get: getAgentData,
  },
  {
    path: '/agent_facts',
    access: noAuth,
    get: getAgentFacts,
  },
  {
    path: '/custom_message',
    access: noAuth,
    post: customMessage,
  },
  {
    path: '/personalities',
    access: noAuth,
    get: getPersonalities,
  },
  {
    path: '/chat_agent',
    access: noAuth,
    post: chatAgent,
  },
  {
    path: '/entities_info',
    access: noAuth,
    get: getEntitiesInfo,
  },
]
