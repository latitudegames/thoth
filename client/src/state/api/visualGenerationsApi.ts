import { rootApi } from './api'
import { ImageType } from '@latitudegames/thoth-core/src/components/ml/VisualGeneration'

export const visualGenerationsApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    fetchFromImageCache: builder.mutation<
      ImageType[],
      { caption: string; cacheTag?: string; topK?: number }
    >({
      query: searchOptions => ({
        url: '/image/cache/lookup',
        method: 'POST',
        body: {
          ...searchOptions,
        },
      }),
    }),
  }),
})

export const { useFetchFromImageCacheMutation } = visualGenerationsApi
