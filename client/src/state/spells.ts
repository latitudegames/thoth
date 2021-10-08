import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Spell as SpellType } from '@latitudegames/thoth-core/types'

import { initDB } from '../database'

const _spells = async () => {
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
    getSpells: builder.query<Spell, true>({
      async queryFn() {
        const spellModel = await _spells()
        const spells = await spellModel.getSpells()

        return { data: spells.map(spell => spell.toJSON()) }
      },
    }),
    getSpell: builder.query<Spell, string>({
      async queryFn(spellId) {
        const spellModel = await _spells()
        const spell = await spellModel.getSpell(spellId)

        return { data: spell.toJSON() as Spell }
      },
    }),
    saveSpell: builder.mutation<Spell, Spell>({
      async queryFn(spell) {
        return { data: {} as Spell }
      },
    }),
    newSpell: builder.mutation<Spell, Partial<Spell>>({
      async queryFn(spellData) {
        const newSpell = { gameState: {}, ...spellData }
        const spellModel = await _spells()

        const spell = await spellModel.newSpell(newSpell)

        return { data: spell.toJSON() as Spell }
      },
    }),
  }),
})

const selectSpellResults = spellApi.endpoints.getSpells

export const useGetSpellSubscription =
  spellApi.endpoints.getSpell.useQuerySubscription

export const { useGetSpellQuery, useLazyGetSpellQuery, useNewSpellMutation } =
  spellApi
