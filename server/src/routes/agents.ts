import { database } from '@latitudegames/thoth-core/src/connectors/database'
import { handleInput } from '@latitudegames/thoth-core/src/connectors/handleInput'
import { createWikipediaAgent } from '@latitudegames/thoth-core/src/connectors/wikipedia'
import Koa from 'koa'

import 'regenerator-runtime/runtime'
import { noAuth } from '../middleware/auth'
import { Route } from '../types'

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
  console.log('ctx.request.body is ', ctx.request.body)
  const { agent, data } = ctx.request.body
  if (!agent || agent == undefined || agent.length <= 0) {
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
    console.error(e)
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
    console.error(e)
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
    console.error(e)
    return (ctx.body = { error: 'internal error' })
  }
}

const executeHandler = async (ctx: Koa.Context) => {
  const message = ctx.request.body.command
  const speaker = ctx.request.body.sender
  const agent = ctx.request.body.agent
  const id = ctx.request.body.id
  const msg = database.instance.getRandomGreeting(agent)
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
  ctx.body = await handleInput(message, speaker, agent)
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
    console.error(e)
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
    console.error(e)
    return (ctx.body = { error: 'internal error' })
  }
}

const getAgentInstancesHandler = async (ctx: Koa.Context) => {
  try {
    const data = await database.instance.getAgentInstances()
    return (ctx.body = data)
  } catch (e) {
    console.error(e)
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
    console.error(e)
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
    console.error(e)
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

  const facts = await database.instance.getSpeakersFacts(agent, speaker, false)

  return (ctx.body = facts)
}
const getFactsCount = async (ctx: Koa.Context) => {
  const agent = ctx.request.query.agent
  const speaker = ctx.request.query.speaker

  const facts = await database.instance.getSpeakersFacts(agent, speaker, false)

  return (ctx.body = facts.length)
}

const getConversation = async (ctx: Koa.Context) => {
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

  return (ctx.body = conversation)
}
const setConversation = async (ctx: Koa.Context) => {
  const agent = ctx.request.body.agent
  const speaker = ctx.request.body.speaker
  const client = ctx.request.body.client
  const channel = ctx.request.body.channel
  const conversation = ctx.request.body.conve

  await database.instance.setConversation(
    agent,
    client,
    channel,
    speaker,
    conversation,
    false
  )
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

  return (ctx.body = conversation.length)
}

const getRelationshipMatrix = async (ctx: Koa.Context) => {
  const agent = ctx.request.query.agent
  const speaker = ctx.request.query.speaker

  try {
    const matrix = database.instance.getRelationshipMatrix(speaker, agent)
    return (ctx.body = matrix)
  } catch (e) {
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
    path: '/relationship_matrix',
    access: noAuth,
    get: getRelationshipMatrix,
    post: setRelationshipMatrix,
  },
]
