import { Spell as SpellType } from '@latitudegames/thoth-core/types'
import {
  createSlice,
  // PayloadAction,
  // createDraftSafeSelector,
  createEntityAdapter,
} from '@reduxjs/toolkit'

// import { RootState } from './store'

export interface Spell {
  user: Record<string, unknown> | null | undefined
  name: string
  graph: SpellType
  gameState: Record<string, unknown>
  createdAt: number
  updatedAt: number
}

const spellAdapater = createEntityAdapter<Spell>()
const initialState = spellAdapater.getInitialState()
// const spellSelectors = spellAsdapater.getSelectors()

const spellSlice = createSlice({
  name: 'spells',
  initialState,
  reducers: {
    spellSaved: spellAdapater.updateOne,
    spellCreated: spellAdapater.addOne,
    spellLoaded: () => {},
    spellDeleted: () => {},
  },
})

export const {} = spellSlice.actions

export default spellSlice.reducer
