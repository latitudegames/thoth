import axios from 'axios'
import Koa from 'koa'

import 'regenerator-runtime/runtime'
import { noAuth } from '../../middleware/auth'
import { Route } from '../../types'
import { CustomError } from '../../utils/CustomError'
import {
  buildThothInterface,
  extractModuleInputKeys,
  runChain,
} from './runChain'
import { getTestSpell } from './testSpells'
import { Graph, Module } from './types'
import { creatorToolsDatabase } from '../../databases/creatorTools'
import { config } from 'dotenv-flow'
config({ path: '.env' })

export const modules: Record<string, unknown> = {}

const chainsHandler = async (ctx: Koa.Context) => {
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
    rootSpell = await creatorToolsDatabase.chains.findOne({
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

  if (!activeSpell?.chain) {
    throw new CustomError(
      'not-found',
      `Spell with name ${spell} and version ${version} not found`
    )
  }

  // TODO use test spells if body option is given
  // const activeSpell = getTestSpell(spell)
  const chain = activeSpell.chain as Graph
  const modules = activeSpell.modules as Module[]

  const gameState = {
    ...rootSpell?.gameState,
    ...userGameState,
  }

  const thoth = buildThothInterface(ctx, gameState)

  const inputKeys = extractModuleInputKeys(chain) as string[]

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
  const outputs = await runChain(chain, (inputs as any) ?? [], thoth, modules)

  const newGameState = thoth.getCurrentGameState()
  const body = { spell: activeSpell.name, outputs, gameState: newGameState }
  ctx.body = body
}

export const chains: Route[] = [
  {
    path: '/chains/:spell/:version',
    access: noAuth,
    post: chainsHandler,
  },
]
