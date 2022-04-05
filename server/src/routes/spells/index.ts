import axios from 'axios'
import Koa from 'koa'
import 'regenerator-runtime/runtime'
import { creatorToolsDatabase } from '../../databases/creatorTools'
import { noAuth } from '../../middleware/auth'
import { Route } from '../../types'
import { CustomError } from '../../utils/CustomError'
import {
  buildThothInterface,
  extractModuleInputKeys,
  runSpell,
} from './runSpell'
import { getTestSpell } from './testSpells'
import { Graph, Module } from './types'

import otJson0 from 'ot-json0'

export const modules: Record<string, unknown> = {}

const runSpellHandler = async (ctx: Koa.Context) => {
  const { spell, version } = ctx.params
  const { isTest, userGameState = {} } = ctx.request.body

  let rootSpell

  if (process.env.USE_LATITUDE_API === 'true') {
    const response = await axios({
      method: 'GET',
      url: process.env.API_URL + '/game/spells/' + spell,
      headers: ctx.headers as any,
      data: ctx.request.body,
    })
    rootSpell = response.data
  } else {
    rootSpell = await creatorToolsDatabase.spells.findOne({
      where: { name: spell },
    })
  }

  // eslint-disable-next-line functional/no-let
  let activeSpell

  if (isTest) {
    console.log('test')
    activeSpell = getTestSpell(spell)
  } else if (version === 'latest') {
    console.log('latest')
    activeSpell = rootSpell
  } else {
    if (process.env.USE_LATITUDE_API === 'true') {
      console.log('checking the api')
      const response = await axios({
        method: 'GET',
        url: process.env.API_URL + `/game/spells/deployed/${spell}/${version}`,
        headers: ctx.headers as any,
        data: ctx.request.body,
      })
      activeSpell = response.data
    } else {
      console.log('getting active spell')
      activeSpell = await creatorToolsDatabase.deployedSpells.findOne({
        where: { name: spell, version },
      })
    }
  }

  //todo validate spell has an input trigger?

  if (!activeSpell?.graph) {
    throw new CustomError(
      'not-found',
      `Spell with name ${spell} and version ${version} not found`
    )
  }

  // TODO use test spells if body option is given
  // const activeSpell = getTestSpell(spell)
  const graph = activeSpell.graph as Graph
  const modules = activeSpell.modules as Module[]

  const gameState = {
    ...rootSpell?.gameState,
    ...userGameState,
  }

  const thoth = buildThothInterface(ctx, gameState)

  const inputKeys = extractModuleInputKeys(graph) as string[]

  let error = null

  // Validates the body of the request against all expected values to ensure they are all present
  const inputs = inputKeys.reduce((inputs, expectedInput: string) => {
    const requestInput = ctx.request.body[expectedInput]

    if (requestInput) {
      inputs[expectedInput] = [requestInput]

      return inputs
    } else {
      error = `Spell expects a value for ${expectedInput} to be provided `
      // throw new CustomError(
      //   'input-failed',
      //   error
      // )
    }
  }, {} as Record<string, unknown>)
  if (error) {
    return (ctx.body = { error })
  }
  const outputs = await runSpell(graph, (inputs as any) ?? [], thoth, modules)

  const newGameState = thoth.getCurrentGameState()
  const body = { spell: activeSpell.name, outputs, gameState: newGameState }
  ctx.body = body
}

// Should we use the Latitude API or run independently?
const latitudeApiKey =
  process.env.LATITUDE_API_KEY !== '' && process.env.LATITUDE_API_KEY

const saveHandler = async (ctx: Koa.Context) => {
  console.log('ctx.request is', ctx.request)
  const body =
    typeof ctx.request.body === 'string'
      ? JSON.parse(ctx.request.body)
      : ctx.request.body

  console.log('ctx.request.body is', ctx.request.body)

  if (!body) throw new CustomError('input-failed', 'No parameters provided')
  if (latitudeApiKey) {
    const response = await axios({
      method: 'POST',
      url: process.env.API_URL + '/game/spells/save',
      headers: ctx.headers as any,
      data: ctx.request.body,
    })

    ctx.body = response.data
    return
  }

  const spell = await creatorToolsDatabase.spells.findOne({
    where: { name: body.name },
  })

  if (
    spell &&
    spell.userId.toString() !== (ctx.state.user?.id ?? 0).toString()
  ) {
    throw new CustomError(
      'input-failed',
      'A spell with that name already exists.'
    )
  }

  if (!spell) {
    const newSpell = await creatorToolsDatabase.spells.create({
      name: body.name,
      graph: body.graph,
      gameState: body.gameState || {},
      modules: body.modules || [],
      userId: ctx.state.user?.id ?? 0,
    })
    return (ctx.body = { id: newSpell.id })
  } else {
    // TODO eventually we should actually validate the body before dumping it in.
    await spell.update(body)
    return (ctx.body = { id: spell.id })
  }
}

const saveDiffHandler = async (ctx: Koa.Context) => {
  const { body } = ctx.request
  const { name, diff } = body

  if (!body) throw new CustomError('input-failed', 'No parameters provided')

  const spell = await creatorToolsDatabase.spells.findOne({
    where: { name },
  })

  if (!spell)
    throw new CustomError('input-failed', `No spell with ${name} name found.`)
  if (!diff)
    throw new CustomError('input-failed', 'No diff provided in request body')

  try {
    const newGraph = otJson0.type.apply(spell.graph, diff)

    const updatedSpell = await creatorToolsDatabase.spells.update(
      {
        graph: newGraph,
      },
      {
        where: { name },
      }
    )

    ctx.response.status = 200
    ctx.body = updatedSpell
  } catch (err) {
    throw new CustomError('server-error', 'Error processing diff.', err)
  }
}

const newHandler = async (ctx: Koa.Context) => {
  if (latitudeApiKey) {
    const response = await axios({
      method: 'POST',
      url: process.env.API_URL + '/game/spells/save',
      headers: ctx.headers as any,
      data: ctx.request.body,
    })

    ctx.body = response.data
    return
  }

  const body = ctx.request.body
  if (!body) throw new CustomError('input-failed', 'No parameters provided')

  const missingBody = ['graph', 'name'].filter(property => !body[property])

  if (missingBody.length > 0) {
    const message = `Request body missing ${missingBody.join(', ')} values`
    throw new CustomError('input-failed', message)
  }

  const spell = await creatorToolsDatabase.spells.findOne({
    where: { name: body.name },
  })

  if (spell) throw new CustomError('input-failed', 'Spell name already taken')

  const newSpell = await creatorToolsDatabase.spells.create({
    name: body.name,
    graph: body.graph,
    gameState: {},
    modules: [],
    userId: ctx.state.user?.id ?? 0,
  })

  return (ctx.body = newSpell)
}

const patchHandler = async (ctx: Koa.Context) => {
  if (latitudeApiKey) {
    const response = await axios({
      method: 'POST',
      url: process.env.API_URL + '/game/spells/save',
      headers: ctx.headers as any,
      data: ctx.request.body,
    })

    return (ctx.body = response.data)
  }

  const name = ctx.params.name
  const userId = ctx.state.user?.id ?? 0

  const spell = await creatorToolsDatabase.spells.findOne({
    where: {
      name,
      userId,
    },
  })
  if (!spell) throw new CustomError('input-failed', 'spell not found')

  await spell.update(ctx.request.body)

  return (ctx.body = { id: spell.id })
}

const getSpellsHandler = async (ctx: Koa.Context) => {
  if (latitudeApiKey) {
    const response = await axios({
      method: 'GET',
      url: process.env.API_URL + '/game/spells',
      headers: ctx.headers as any,
      data: ctx.request.body,
    })

    return (ctx.body = response.data)
  }

  const spells = await creatorToolsDatabase.spells.findAll({
    attributes: {
      exclude: ['graph', 'gameState', 'modules'],
    },
  })
  ctx.body = spells
}

const getSpellHandler = async (ctx: Koa.Context) => {
  const name = ctx.params.name
  if (latitudeApiKey) {
    const response = await axios({
      method: 'GET',
      url: process.env.API_URL + '/game/spells/' + name,
      headers: ctx.headers as any,
      data: ctx.request.body,
    })

    return (ctx.body = response.data)
  }
  try {
    const spell = await creatorToolsDatabase.spells.findOne({
      where: { name, userId: ctx.state.user?.id ?? 0 },
    })

    if (!spell) {
      const newSpell = await creatorToolsDatabase.spells.create({
        userId: ctx.state.user?.id ?? 0,
        name,
        graph: { id: 'demo@0.1.0', nodes: {} },
        gameState: {},
        modules: [],
      })
      userId: ctx.state.user?.id ?? 0, (ctx.body = newSpell)
    } else {
      ctx.body = spell
    }
  } catch (e) {
    console.error(e)
  }
}

const deleteHandler = async (ctx: Koa.Context) => {
  const name = ctx.params.name
  if (latitudeApiKey) {
    const response = await axios({
      method: 'DELETE',
      url: process.env.API_URL + '/game/spells/' + name,
      headers: ctx.headers as any,
      data: ctx.request.body,
    })

    return (ctx.body = response.data)
  }
  const spell = await creatorToolsDatabase.spells.findOne({
    where: { name, userId: ctx.state.user?.id ?? 0 },
  })
  if (!spell) throw new CustomError('input-failed', 'spell not found')

  try {
    await spell.destroy()

    ctx.body = true
  } catch (err) {
    throw new CustomError('server-error', 'error deleting spell')
  }
}

const deploySpellHandler = async (ctx: Koa.Context) => {
  const name = ctx.params.name
  if (latitudeApiKey) {
    const response = await axios({
      method: 'POST',
      url: process.env.API_URL + '/game/spells/' + name + '/deploy',
      headers: ctx.headers as any,
      data: ctx.request.body,
    })

    return (ctx.body = response.data)
  }
  const body =
    typeof ctx.request.body === 'string'
      ? JSON.parse(ctx.request.body)
      : ctx.request.body

  const spell = await creatorToolsDatabase.spells.findOne({ where: { name } })
  if (!spell) throw new CustomError('input-failed', 'spell not found')

  const lastDeployedSpell = await creatorToolsDatabase.deployedSpells.findOne({
    where: { name },
    order: [['version', 'desc']],
  })

  const newVersion: number = lastDeployedSpell
    ? lastDeployedSpell.version + 1
    : 1

  const newDeployedSpell = await creatorToolsDatabase.deployedSpells.create({
    name: spell.name,
    graph: spell.graph,
    versionName: body?.versionName,
    userId: ctx.state.user?.id ?? 0,
    version: newVersion,
    message: body?.message,
    modules: spell.modules,
  })

  return (ctx.body = newDeployedSpell.id)
}

const getdeployedSpellsHandler = async (ctx: Koa.Context) => {
  const name = ctx.params.name
  if (latitudeApiKey) {
    const response = await axios({
      method: 'GET',
      url: process.env.API_URL + '/game/spells/deployed/' + name,
      headers: ctx.headers as any,
      data: ctx.request.body,
    })

    return (ctx.body = response.data)
  }

  const spells = await creatorToolsDatabase.deployedSpells.findAll({
    where: { name },
    attributes: { exclude: ['graph'] },
    order: [['version', 'desc']],
  })
  return (ctx.body = spells)
}

const getDeployedSpellHandler = async (ctx: Koa.Context) => {
  console.log('handling')
  console.log('ctx.request', ctx.request.body)
  console.log('ctx.params', ctx.params)
  const name = ctx.params.name ?? 'default'
  const version = ctx.params.version ?? 'latest'
  if (latitudeApiKey) {
    const response = await axios({
      method: 'GET',
      url: process.env.API_URL + `/game/spells/deployed/${name}/${version}`,
      headers: ctx.headers as any,
      data: ctx.request.body,
    })

    return (ctx.body = response.data)
  }
  const spell = await creatorToolsDatabase.deployedSpells.findOne({
    where: { name: name, version: version },
  })
  console.log('done')
  return (ctx.body = spell)
}

export const spells: Route[] = [
  {
    path: '/game/spells/save',
    access: noAuth,
    post: saveHandler,
  },
  {
    path: '/game/spells/saveDiff',
    access: noAuth,
    post: saveDiffHandler,
  },
  {
    path: '/game/spells',
    access: noAuth,
    post: newHandler,
  },
  {
    path: '/game/spells/:name',
    access: noAuth,
    patch: patchHandler,
    delete: deleteHandler,
  },
  {
    path: '/game/spells',
    access: noAuth,
    get: getSpellsHandler,
  },
  {
    path: '/game/spells/:name',
    access: noAuth,
    get: getSpellHandler,
  },
  {
    path: '/game/spells/:name/deploy',
    access: noAuth,
    post: deploySpellHandler,
  },
  {
    path: '/game/spells/deployed/:name',
    access: noAuth,
    get: getdeployedSpellsHandler,
  },
  {
    path: '/game/spells/deployed/:name/:version',
    access: noAuth,
    get: getDeployedSpellHandler,
  },
  {
    path: '/spells/:spell/:version',
    access: noAuth,
    post: runSpellHandler,
  },
]
