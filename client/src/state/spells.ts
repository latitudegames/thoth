import { createSelector } from '@reduxjs/toolkit'
import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { Spell as SpellType } from '@latitudegames/thoth-core/types'

import { getAuthHeader } from '../utils/authHelper'
import { initDB } from '../database'
import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import { updateGameState } from './gameState'

// function camelize(str) {
//   return str
//     .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
//       return index === 0 ? word.toLowerCase() : word.toUpperCase()
//     })
//     .replace(/\s+/g, '')
// }

// const _spellModel = async () => {
//   const db = await initDB()
//   const { spells } = db.models
//   return spells
// }

const _moduleModel = async () => {
  const db = await initDB()
  const { modules } = db.models
  return modules
}
export interface Spell {
  id?: string
  user?: Record<string, unknown> | null | undefined
  name: string
  chain: SpellType
  modules: SpellType[]
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

export const spellApi = createApi({
  reducerPath: 'spellApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/game` || 'localhost:8000/game',
    prepareHeaders: headers => {
      const authHeader = getAuthHeader()
      if (authHeader?.Authorization)
        headers.set('authorization', authHeader['Authorization'])
      return headers
    },
  }),
  tagTypes: ['Spell', 'Version'],
  endpoints: builder => ({
    getSpells: builder.query<Spell[], void>({
      providesTags: ['Spell'],
      query: () => '/spells',
    }),
    getSpell: builder.query<Spell, string>({
      providesTags: ['Spell'],
      query: spellId => {
        return {
          url: `spells/${spellId}`,
        }
      },
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const { data: spell } = await queryFulfilled

        dispatch(
          updateGameState({ state: spell.gameState, spellId: spell.name })
        )
      },
    }),
    saveSpell: builder.mutation<Partial<Spell>, Partial<Spell>>({
      // invalidatesTags: ['Spell'],
      // needed to use queryFn as query option didnt seem to allow async functions.
      async queryFn(spell, { dispatch, getState }, extraOptions, baseQuery) {
        const moduleModel = await _moduleModel()
        const modules = await moduleModel.getSpellModules(spell)

        if (spell.gameState)
          dispatch(
            updateGameState({ state: spell.gameState, spellId: spell.name })
          )

        spell.modules = modules

        const baseQueryOptions = {
          url: 'spells/save',
          body: spell,
          method: 'POST',
        }

        // cast into proper response shape expected by queryFn return
        // probbably a way to directly pass in type args to baseQuery but couldnt find.
        return baseQuery(baseQueryOptions) as QueryReturnValue<
          Partial<Spell>,
          FetchBaseQueryError,
          unknown
        >
      },
    }),
    newSpell: builder.mutation<Spell, Partial<Spell>>({
      invalidatesTags: ['Spell'],
      query: spellData => {
        const spell = {
          ...spellData,
          gameState: {},
        }
        return {
          url: '/spells/save',
          method: 'POST',
          body: spell,
        }
      },
    }),
    deploySpell: builder.mutation<DeployedSpellVersion, DeployArgs>({
      invalidatesTags: ['Version'],
      query({ spellId, message }) {
        return {
          url: `/spells/${spellId}/deploy`,
          body: {
            message,
          },
          method: 'POST',
        }
      },
    }),
    getDeployments: builder.query<DeployedSpellVersion[], string>({
      providesTags: ['Version'],
      query: spellId => ({ url: `/spells/deployed/${spellId}` }),
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
