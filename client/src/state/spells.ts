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
    // getSpells: builder.query<Spell, true>({
    //   queryFn: getSpells,
    // }),
    getSpell: builder.query<Spell, number>({
      async queryFn(args) {
        console.log('ARGS', args)
        return { data: {} as Spell }
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
        const spells = await _spells()

        const spell = await spells.newSpell(newSpell)

        return { data: spell.toJSON() as Spell }
      },
    }),
  }),
})

export const { useGetSpellQuery, useLazyGetSpellQuery, useNewSpellMutation } =
  spellApi
