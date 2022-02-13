import { createWikipediaAgent } from '@latitudegames/thoth-core/src/connectors/wikipedia'
import agentConfig from '@latitudegames/thoth-core/src/connectors/agentConfig'
import { database } from '@latitudegames/thoth-core/src/connectors/database'
import { handleInput } from '@latitudegames/thoth-core/src/connectors/handleInput'
import Koa from 'koa'
import 'regenerator-runtime/runtime'
import { noAuth } from '../middleware/auth'
import { Route } from '../types'

export const modules: Record<string, unknown> = {}

function clientSettingsToInstance(settings: any) {
  function addSettingForClient(array: any, client: any, setting: any) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].client === client) {
        array[i].settings.push({ name: setting._name, value: setting.value })
        return array
      }
    }

    array.push({
      client: client,
      enabled: false,
      settings: [{ name: setting._name, value: setting._defaultValue }],
    })
    return array
  }

  let res = []

  for (let i = 0; i < settings.length; i++) {
    res = addSettingForClient(res, settings[i].client, {
      _name: settings[i].name,
      value: settings[i].defaultValue,
    })
  }

  return res
}

const getAgentsHandler = async (ctx: Koa.Context) => {
  const agents = await database.instance.getAgents()
  console.log("Handing back agents ", agents);
  ctx.body = agents
}

const getAgentHandler = async (ctx: Koa.Context) => {
  const agent = await database.instance.getAgent(ctx.query.agent as string)
  if (agent == null) {
    return {}
  }
  console.log("agent is ", agent);
  ctx.body = {
    ignoredKeywords: (
      await database.instance.getIgnoredKeywordsData(agent)
    ).trim(),
    dialogue: agent.dialog,
    dialog: agent.dialog,
    facts: agent.facts,
    monologue: agent.monologue,
    personality: agent.personality,
    greetings: agent.greetings,
  }
}

const createOrUpdateAgentHandler = async (ctx: Koa.Context) => {
  console.log("ctx.request.body is ", ctx.request.body)
  const { agentName, data } = ctx.request.body
  if (!agentName || agentName == undefined || agentName.length <= 0) {
    return (ctx.body = { error: 'invalid agent name' })
  }

  const agentExists = await database.instance.getAgentExists(agentName)
  if (!agentExists) {
    await database.instance.createAgent(agentName)
  }
  // TODO: Combine all of these!
  try {
    await Promise.all([
      database.instance.setDialogue(agentName, data?.dialog ?? ''),
      database.instance.setAgentFacts(agentName, data?.facts ?? '', true),
      database.instance.setMonologue(agentName, data?.monologue ?? ''),
      database.instance.setPersonality(agentName, data?.personality ?? ''),
      database.instance.setGreetings(
        agentName,
        data?.greetings ?? ''
      )
    ])

  } catch (e) {
    return (ctx.body = { error: 'internal error' })
  }

  ctx.body = 'ok'
}

const deleteAgentHandler = async (ctx: Koa.Context) => {
  console.log("Request is", ctx.request.body)
  const { agentName } = ctx.request.body
  if (agentName === 'common') {
    return (ctx.body = { error: "you can't delete the default agent" })
  }

  await database.instance.deleteAgent(agentName)
  return (ctx.body = 'ok')
}

const getConfigHandler = async (ctx: Koa.Context) => {
  const data = {
    config: await database.instance.getConfig(),
  }

  return (ctx.body = data)
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
  const data = ctx.request.body.config
  try {
    for (let i = 0; i < data.length; i++) {
      await agentConfig.instance.set(data[i].key, data[i].value)
    }

    ctx.body = 'ok'
  } catch (e) {
    console.error(e)
    return (ctx.body = { error: 'internal error' })
  }
}

const deleteConfigHandler = async (ctx: Koa.Context) => {
  const data = ctx.request.body
  console.log("delete data is ", data);
  try {
    await database.instance.deleteConfig(data)
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
  ctx.body = await handleInput(message, speaker, agent, null, 'web', id)
}

const getPromptsHandler = async (ctx: Koa.Context) => {
  const config = await database.instance.getConfig() as any;
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
  try {
    // TODO: Combine me!
    await database.instance.setConfig('xr_world', data.xr_world)
    await database.instance.setConfig('fact_summarization', data.fact)
    await database.instance.setConfig('opinion', data.opinion)
    await database.instance.setConfig('xr_room', data.xr_world)

    return (ctx.body = 'ok')
  } catch (e) {
    console.error(e)
    return (ctx.body = { error: 'internal error' })
  }
}

const getAgentInstancesHandler = async (ctx: Koa.Context) => {
  try {
    let data = await database.instance.getAgentInstances()
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
        clients: clientSettingsToInstance(
          await database.instance.getConfig()
        ),
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
  let instanceId = data.id
  const personality = data.personality?.trim() ?? 'common'
  let clients = data.clients
  const enabled = data.enabled

  if (!instanceId || instanceId === undefined || instanceId <= 0) {
    instanceId = 0
    while (
      (await database.instance.instanceIdExists(instanceId)) ||
      instanceId <= 0
    ) {
      instanceId++
    }
  }
  if (!clients || clients === undefined || clients === 'none') {
    clients = clientSettingsToInstance(
      await database.instance.getConfig()
    )
  }

  try {
    await database.instance.updateAgentInstances(
      instanceId,
      personality,
      clients,
      enabled
    )
    ctx.body = 'ok'
  } catch (e) {
    console.error(e)
    return (ctx.body = { error: 'internal error' })
  }
}

const deleteAgentInstanceHandler = async (ctx: Koa.Context) => {
  const { agentName } = ctx.request.body
  await database.instance.deleteAgentInstance(agentName)
  return (ctx.body = 'ok')
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
    path: '/config',
    access: noAuth,
    get: getConfigHandler,
    post: addConfigHandler,
    put: updateConfigHandler,
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
]
