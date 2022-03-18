import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'
import tabReducer from './tabs'
import { spellApi } from './api/spells'

export const store = configureStore({
  reducer: {
    tabs: tabReducer,
    [spellApi.reducerPath]: spellApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(spellApi.middleware),
})

setupListeners(store.dispatch)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
