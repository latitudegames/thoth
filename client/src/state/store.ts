import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import tabReducer from './tabs'

export const store = configureStore({
  reducer: {
    tabs: tabReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
