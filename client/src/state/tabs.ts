import {
  createSlice,
  // PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit'

import { RootState } from './store'

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

const initialState = tabAdapater.getInitialState({ activeTab: {} })

export const tabSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    openTab: () => {},
    closeTab: () => {},
    switchTab: () => {},
    clearTabs: () => {},
    saveTabLayout: () => {},
  },
})

export const { openTab, closeTab, switchTab, clearTabs, saveTabLayout } =
  tabSlice.actions

export const selectActiveTab = (state: RootState) => state.tabs.active

export default tabSlice.reducer
