import { createSelector } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Spell as SpellType } from '@latitudegames/thoth-core/types'

import { initDB } from '../database'

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
  spellId: Pick<Spell, 'id'>
  version: string
  url?: string
}

export interface DeployArgs {
  spellId: Pick<Spell, 'id'>
  message: string
}

// stubbed temp data
const versions: DeployedSpellVersion[] = []

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
    deploy: builder.mutation<DeployedSpellVersion, DeployArgs>({
      invalidatesTags: ['Version'],
      async queryFn({ spellId, message }) {
        const version = '0.0.' + versions.length + 1
        const deployment = { version, message, spellId }

        versions.push(deployment)

        return {
          data: deployment as DeployedSpellVersion,
        }
      },
    }),
    getVersions: builder.query<DeployedSpellVersion[], void>({
      providesTags: ['Version'],
      async queryFn() {
        return {
          data: versions,
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
} = spellApi

export const useGetSpellSubscription =
  spellApi.endpoints.getSpell.useLazyQuerySubscription
