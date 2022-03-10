import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getAuthHeader } from '../../contexts/AuthProvider'
<<<<<<< HEAD
import { latitudeApiRootUrl } from '../../config'

=======
import { thothApiRootUrl } from '../../config'
console.log("thothApiRootUrl is", thothApiRootUrl)
>>>>>>> Downstream merge with main branch, fix some things
// initialize an empty api service that we'll inject endpoints into later as needed
export const rootApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
<<<<<<< HEAD
    baseUrl: latitudeApiRootUrl,
=======
    baseUrl: thothApiRootUrl,
>>>>>>> Downstream merge with main branch, fix some things
    prepareHeaders: async headers => {
      const authHeader = await getAuthHeader()
      if (authHeader?.Authorization)
        headers.set('authorization', authHeader['Authorization'])
      return headers
    },
  }),
  tagTypes: ['Spell', 'Version'],
  endpoints: () => ({}),
})

console.log("rootApi is")
console.log(rootApi)