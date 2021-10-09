import { createSelector } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Spell as SpellType } from '@latitudegames/thoth-core/types'

import { initDB } from '../database'

function camelize(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+/g, '')
}

const _spellModel = async () => {
  const db = await initDB()
  const { spells } = db.models
  return spells
}
export interface Spell {
  id?: string
  user?: Record<string, unknown> | null | undefined
  name: string
  graph: SpellType
  gameState: Record<string, unknown>
  createdAt?: number
  updatedAt?: number
}

export interface DeployedSpellVersion {
  spellId: string
  version: string
  message?: string
  url?: string
}

export interface DeployArgs {
  spellId: string
  message: string
}

// stubbed temp data
const versions: Record<string, DeployedSpellVersion[]> = {}

export const spellApi = createApi({
  reducerPath: 'spellApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL || 'localhost:8000/',
  }),
  tagTypes: ['Spell', 'Version'],
  endpoints: builder => ({
    getSpells: builder.query<Spell[], void>({
      providesTags: ['Spell'],
      async queryFn() {
        const spellModel = await _spellModel()
        const spells = await spellModel.getSpells()

        return { data: spells.map(spell => spell.toJSON()) }
      },
    }),
    getSpell: builder.query<Spell, string>({
      providesTags: ['Spell'],
      async queryFn(spellId) {
        const spellModel = await _spellModel()
        const spell = await spellModel.getSpell(spellId)

        return { data: spell.toJSON() }
      },
    }),
    saveSpell: builder.mutation<Partial<Spell>, Partial<Spell>>({
      invalidatesTags: ['Spell'],
      async queryFn(spell) {
        const spellModel = await _spellModel()
        const updatedSpell = await spellModel.saveSpell(spell.name, spell)
        return { data: updatedSpell.toJSON() }
      },
    }),
    newSpell: builder.mutation<Spell, Partial<Spell>>({
      invalidatesTags: ['Spell'],
      async queryFn(spellData) {
        const newSpell = { gameState: {}, ...spellData }
        const spellModel = await _spellModel()

        const spell = await spellModel.newSpell(newSpell)

        return { data: spell.toJSON() }
      },
    }),
    deploySpell: builder.mutation<DeployedSpellVersion, DeployArgs>({
      invalidatesTags: ['Version'],
      async queryFn({ spellId, message }) {
        if (!versions[spellId]) versions[spellId] = []

        const _versions = versions[spellId]
        const version = '0.0.' + (_versions.length + 1)
        const url = `${process.env.REACT_APP_API_URL}/spells/${camelize(
          spellId
        )}/${version}`
        const deployment = { version, message, spellId, url }

        versions[spellId].push(deployment)

        return {
          data: deployment as DeployedSpellVersion,
        }
      },
    }),
    getDeployments: builder.query<DeployedSpellVersion[], string>({
      providesTags: ['Version'],
      async queryFn(spellId) {
        console.log('egtting versions!')
        const result = versions[spellId] || []
        console.log('results', result)
        return {
          data: result.reverse(),
        }
      },
    }),
  }),
})

const selectSpellResults = spellApi.endpoints.getSpells.select()
const emptySpells = []

export const selectAllSpells = createSelector(
  selectSpellResults,
  spellResult => spellResult?.data || emptySpells
)

export const selectSpellById = createSelector(
  [selectAllSpells, (state, spellId) => spellId],
  (spells, spellId) =>
    spells.find(spell => {
      return spell.name === spellId
    })
)

export const {
  useGetSpellQuery,
  useGetSpellsQuery,
  useLazyGetSpellQuery,
  useNewSpellMutation,
  useSaveSpellMutation,
  useDeploySpellMutation,
  useGetDeploymentsQuery,
} = spellApi

export const useGetSpellSubscription =
  spellApi.endpoints.getSpell.useLazyQuerySubscription
