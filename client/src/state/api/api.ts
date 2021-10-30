import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getAuthHeader } from '../../utils/authHelper'

// initialize an empty api service that we'll inject endpoints into later as needed
export const rootApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/` || 'localhost:8000/',
    prepareHeaders: headers => {
      const authHeader = getAuthHeader()
      if (authHeader?.Authorization)
        headers.set('authorization', authHeader['Authorization'])
      return headers
    },
  }),
  tagTypes: ['Spell', 'Version'],
  endpoints: () => ({}),
})
