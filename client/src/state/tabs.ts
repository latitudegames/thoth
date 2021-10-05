import {
  createSlice,
  // PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit'

// import { RootState } from './store'

export interface Tab {
  id: string
  name: string
  active: boolean
  layoutJson: Record<string, unknown>
  type: 'spell' | 'module'
  // probably going to need to insert a proper spell type in here
  spell: string
  // this will also be a ref to a property somewhere else
  module: string
}

const tabAdapater = createEntityAdapter<Tab>()

const initialState = tabAdapater.getInitialState()

export const tabSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    tabOpened: tabAdapater.addOne,
    tabClosed: tabAdapater.removeOne,
    tabSwitched: tabAdapater.updateOne,
    tabsCleared: tabAdapater.removeAll,
    tabLayoutSaved: () => {},
  },
})

export const {
  tabOpened,
  tabClosed,
  tabSwitched,
  tabsCleared,
  tabLayoutSaved,
} = tabSlice.actions

// export const selectActiveTab = (state: RootState) => state.tabs.active

export default tabSlice.reducer
