import { combineReducers } from '@reduxjs/toolkit'

import { spellApi } from './api/spells'
import tabReducer from './tabs'
import preferencesReducer from './preferences'

export default combineReducers({
  tabs: tabReducer,
  preferences: preferencesReducer,
  [spellApi.reducerPath]: spellApi.reducer,
})
