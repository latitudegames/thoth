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
  user?: Record<string, unknown> | null | undefined
  name: string
  graph: SpellType
  gameState: Record<string, unknown>
  createdAt?: number
  updatedAt?: number
}

export const spellApi = createApi({
  reducerPath: 'spellApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL || 'localhost:8000/',
  }),
  tagTypes: ['Spell'],
  endpoints: builder => ({
    getSpells: builder.query<Spell[], void>({
      async queryFn() {
        const spellModel = await _spellModel()
        const spells = await spellModel.getSpells()

        return { data: spells.map(spell => spell.toJSON()) }
      },
      providesTags: ['Spell'],
    }),
    getSpell: builder.query<Spell, string>({
      async queryFn(spellId) {
        const spellModel = await _spellModel()
        const spell = await spellModel.getSpell(spellId)

        return { data: spell.toJSON() }
      },
    }),
    saveSpell: builder.mutation<Partial<Spell>, Partial<Spell>>({
      async queryFn(spell) {
        const spellModel = await _spellModel()
        const updatedSpell = await spellModel.saveSpell(spell.name, spell)
        return { data: updatedSpell.toJSON() }
      },
      invalidatesTags: ['Spell'],
    }),
    newSpell: builder.mutation<Spell, Partial<Spell>>({
      async queryFn(spellData) {
        const newSpell = { gameState: {}, ...spellData }
        const spellModel = await _spellModel()

        const spell = await spellModel.newSpell(newSpell)

        return { data: spell.toJSON() }
      },
      invalidatesTags: ['Spell'],
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
