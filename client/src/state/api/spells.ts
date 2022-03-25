import { createSelector } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import { rootApi } from './api'
import { ChainData } from '@latitudegames/thoth-core/types'
// function camelize(str) {
//   return str
//     .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
//       return index === 0 ? word.toLowerCase() : word.toUpperCase()
//     })
//     .replace(/\s+/g, '')
// }
export interface Spell {
  id?: string
  user?: Record<string, unknown> | null | undefined
  name: string
  chain: ChainData
  // Spells: Module[]
  gameState: Record<string, unknown>
  createdAt?: number
  updatedAt?: number
}

export interface DeployedSpellVersion {
  spellId: string
  version: string
  message?: string
  versionName?: string
  url?: string
  chain?: ChainData
}

export interface DeployArgs {
  spellId: string
  message: string
}

export interface GetDeployArgs {
  spellId: string
  version: string
}

export interface PatchArgs {
  spellId: string
  update: Partial<Spell>
}

export const spellApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    getSpells: builder.query<Spell[], void>({
      providesTags: ['Spells'],
      query: () => 'game/spells',
    }),
    getSpell: builder.query<Spell, string>({
      providesTags: ['Spell'],
      query: spellId => {
        return {
          url: `game/spells/${spellId}`,
        }
      },
    }),
    saveSpell: builder.mutation<Partial<Spell>, Partial<Spell> | Spell>({
      invalidatesTags: ['Spell'],
      // needed to use queryFn as query option didnt seem to allow async functions.
      async queryFn(spell, { dispatch }, extraOptions, baseQuery) {
        const baseQueryOptions = {
          url: 'game/spells/save',
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
      invalidatesTags: ['Spells'],
      query: spellData => ({
        url: 'game/spells',
        method: 'POST',
        body: spellData,
      }),
    }),
    patchSpell: builder.mutation<Spell, PatchArgs>({
      invalidatesTags: ['Spell'],
      query({ spellId, update }) {
        return {
          url: `game/spells/${spellId}`,
          body: {
            ...update,
          },
          method: 'PATCH',
        }
      },
    }),
    deleteSpell: builder.mutation<string[], boolean>({
      invalidatesTags: ['Spells'],
      query: spellId => ({
        url: `game/spells/${spellId}`,
        method: 'DELETE',
      }),
    }),
    deploySpell: builder.mutation<DeployedSpellVersion, DeployArgs>({
      invalidatesTags: ['Version'],
      query({ spellId, ...update }) {
        return {
          url: `game/spells/${spellId}/deploy`,
          body: update,
          method: 'POST',
        }
      },
    }),
    getDeployments: builder.query<DeployedSpellVersion[], string>({
      providesTags: ['Version'],
      query: spellId => ({ url: `game/spells/deployed/${spellId}` }),
    }),
    getDeployment: builder.query<DeployedSpellVersion, GetDeployArgs>({
      providesTags: ['Version'],
      query: ({ spellId, version }) => ({
        url: `game/spells/deployed/${spellId}/${version}`,
      }),
    }),
  }),
})

const selectSpellResults = spellApi.endpoints.getSpells.select()
const emptySpells = []

export const selectAllSpells = createSelector(
  selectSpellResults,
  spellResult => spellResult?.data || emptySpells
)

export const {
  useGetSpellQuery,
  useGetSpellsQuery,
  useLazyGetSpellQuery,
  useNewSpellMutation,
  useDeleteSpellMutation,
  useSaveSpellMutation,
  useDeploySpellMutation,
  usePatchSpellMutation,
  useGetDeploymentsQuery,
  useLazyGetDeploymentQuery,
} = spellApi

export const useGetSpellSubscription =
  spellApi.endpoints.getSpell.useLazyQuerySubscription
