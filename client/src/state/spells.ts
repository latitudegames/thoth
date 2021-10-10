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

function camelize(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+/g, '')
}

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
  graph: SpellType
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

// stubbed temp data
const versions: Record<string, DeployedSpellVersion[]> = {}

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
    }),
    saveSpell: builder.mutation<Partial<Spell>, Partial<Spell>>({
      invalidatesTags: ['Spell'],
      // needed to use queryFn as query option didnt seem to allow async functions.
      async queryFn(spell, api, extraOptions, baseQuery) {
        const moduleModel = await _moduleModel()
        const modules = await moduleModel.getSpellModules(spell)

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
