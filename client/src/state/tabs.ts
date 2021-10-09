import { v4 as uuidv4 } from 'uuid'
import {
  createSlice,
  // PayloadAction,
  createDraftSafeSelector,
  createEntityAdapter,
} from '@reduxjs/toolkit'

import { RootState } from './store'
import defaultJson from '../contexts/layouts/defaultLayout.json'

// Used to set workspaces to tabs
const workspaceMap = {
  default: defaultJson,
}
export interface Tab {
  id: string
  name: string
  active: boolean
  layoutJson: Record<string, unknown>
  type?: 'spell' | 'module'
  // probably going to need to insert a proper spell type in here
  spell?: string
  // this will also be a ref to a property somewhere else
  module: string
}

// Entity adapter
const tabAdapater = createEntityAdapter<Tab>()
const tabSelectors = tabAdapater.getSelectors()

// Initial State
const initialState = tabAdapater.getInitialState()

// Selectors
const _activeTabSelector = createDraftSafeSelector(
  tabSelectors.selectAll,
  tabs => {
    return Object.values(tabs).find(tab => tab?.active)
  }
)

// Used to build a tab with various defaults set, as well as workspace json and UUID
const buildTab = (tab, properties = {}) => ({
  ...tab,
  name: tab.name || 'Untitled',
  id: uuidv4(),
  layoutJson: workspaceMap[tab.workspace || 'default'],
  spell: tab?.spell || null,
  type: tab?.type || 'module',
  module: tab?.moduleName || null,
  ...properties,
})

// This is the primary composed of our "duck", and returns a number of helper functions and properties.
export const tabSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    tabOpened: (state, action) => {
      const activeTab = _activeTabSelector(state) as Tab
      if (activeTab) activeTab.active = false

      const tab = buildTab(action.payload, { active: true })
      tabAdapater.addOne(state, tab)
    },
    tabClosed: tabAdapater.removeOne,
    tabSwitched: tabAdapater.updateOne,
    tabsCleared: tabAdapater.removeAll,
    tabLayoutSaved: () => {},
  },
})

// actions
export const {
  tabOpened,
  tabClosed,
  tabSwitched,
  tabsCleared,
  tabLayoutSaved,
} = tabSlice.actions

// selectors
export const activeTabSelector = (state: RootState) =>
  _activeTabSelector(state.tabs)

export default tabSlice.reducer
