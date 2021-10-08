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
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL || 'localhost:8000/',
  }),
  endpoints: builder => ({
    getSpells: builder.query<Spell[], true>({
      async queryFn() {
        const spellModel = await _spellModel()
        const spells = await spellModel.getSpells()

        return { data: spells.map(spell => spell.toJSON()) }
      },
    }),
    getSpell: builder.query<Spell, string>({
      async queryFn(spellId) {
        const spellModel = await _spellModel()
        const spell = await spellModel.getSpell(spellId)

        return { data: spell.toJSON() }
      },
    }),
    saveSpell: builder.mutation<Spell, Spell>({
      async queryFn(spell) {
        const spellModel = await _spellModel()
        const updatedSpell = await spellModel.saveSpell(spell)
        return { data: updatedSpell.toJSON() }
      },
    }),
    newSpell: builder.mutation<Spell, Partial<Spell>>({
      async queryFn(spellData) {
        const newSpell = { gameState: {}, ...spellData }
        const spellModel = await _spellModel()

        const spell = await spellModel.newSpell(newSpell)

        return { data: spell.toJSON() }
      },
    }),
  }),
})

// const selectSpellResults = spellApi.endpoints.getSpells()

export const {
  useGetSpellQuery,
  useLazyGetSpellQuery,
  useNewSpellMutation,
  useSaveSpellMutation,
} = spellApi

export const useGetSpellSubscription =
  spellApi.endpoints.getSpell.useQuerySubscription
