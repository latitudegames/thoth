import { useContext, createContext, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useLocation } from 'wouter'

import LoadingScreen from '../features/common/LoadingScreen/LoadingScreen'
import { useDB } from './DatabaseProvider'
import defaultJson from './layouts/defaultLayout.json'
import { usePubSub } from './PubSubProvider'

const Context = createContext({
  tabs: [],
  activeTab: {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  openTab: async options => {},
  switchTab: () => {},
  closeTab: () => {},
  saveTabLayout: () => {},
  clearTabs: () => {},
})

// Map of workspaces
const workspaceMap = {
  default: defaultJson,
}

export const useTabManager = () => useContext(Context)

const TabManager = ({ children }) => {
  const { db } = useDB()

  // eslint-disable-next-line no-unused-vars
  const { events, publish } = usePubSub()
  // eslint-disable-next-line no-unused-vars
  const [, setLocation] = useLocation()
  const [tabs, setTabs] = useState(null)
  const [activeTab, setActiveTab] = useState(null)

  // Suscribe to changes in the database for active tab, and all tabs
  useEffect(() => {
    if (!db) return
    ;(async () => {
      const activeTab = await db.tabs
        .findOne({ selector: { active: true } })
        .exec()
      const tabs = await db.tabs.find().exec()

      if (activeTab) setActiveTab(activeTab.toJSON())
      if (tabs && tabs.length > 0) setTabs(tabs.map(tab => tab.toJSON()))
    })()
  }, [db])

  const refreshTabs = async () => {
    const tabs = await db.tabs.find().exec()
    if (tabs && tabs.length > 0) setTabs(tabs.map(tab => tab.toJSON()))
  }

  const openTab = async ({
    workspace = 'default',
    name = 'Untitled',
    type = 'module',
    moduleName,
    spellId = null,
    openNew = true,
  }) => {
    // don't open a new tab if one is already open
    if (!openNew) {
      const tabOpened = await switchTab(null, { module: { $eq: moduleName } })
      if (tabOpened) return
    }

    const newTab = {
      layoutJson: workspaceMap[workspace],
      name,
      id: uuidv4(),
      spell: spellId,
      module: moduleName,
      type: type,
      active: true,
    }

    const newTabDoc = await db.tabs.insert(newTab)
    setActiveTab(newTabDoc.toJSON())
  }

  const closeTab = async tabId => {
    const tab = await db.tabs.findOne({ selector: { id: tabId } }).exec()
    if (!tab) return
    publish(events.$CLOSE_EDITOR(tabId))
    await tab.remove()
    const tabs = await db.tabs.find().exec()

    // Switch to the last tab down.
    if (tabs.length === 0) {
      setLocation('/home')
      return
    }
    switchTab(tabs[0].id)
  }

  const switchTab = async (tabId, query) => {
    console.log('Switching tab')
    const selector = query ? query : { id: tabId }
    const tab = await db.tabs.findOne({ selector }).exec()
    if (!tab) return false
    await tab.atomicPatch({ active: true })

    setActiveTab(tab.toJSON())
    await refreshTabs()
    return true
  }

  const clearTabs = async () => {
    await db.tabs.find().remove()
  }

  const saveTabLayout = async (tabId, json) => {
    const tab = await db.tabs.findOne({ selector: { id: tabId } }).exec()
    await tab.atomicPatch({ layoutJson: json })
  }

  const publicInterface = {
    tabs,
    activeTab,
    openTab,
    switchTab,
    closeTab,
    saveTabLayout,
    clearTabs,
  }

  if (!tabs) return <LoadingScreen />

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

export default TabManager
