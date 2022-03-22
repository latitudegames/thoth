import {
  Layout as LayoutComponent,
  Model,
  Actions,
  DockLocation,
  TabNode,
  TabSetNode,
} from 'flexlayout-react'
import { useContext, createContext, useEffect, useState, useRef } from 'react'

import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'
import { usePubSub } from '@/contexts/PubSubProvider'
import { useTabManager } from '@/contexts/TabManagerProvider'
import { useGetSpellQuery, useSaveSpellMutation } from '@/state/api/spells'
// Component types are listed here which are used to load components from the data sent by rete
const windowTypes = {
  TEXT_EDITOR: 'textEditor',
  INSPECTOR: 'inspector',
  STATE_MANAGER: 'stateManager',
  AGENT_MANAGER: 'agentManager',
  SEARCH_CORPUS: 'searchCorpus',
  CONFIG_MANAGER: 'configManager',
  ENT_MANAGER: 'entManager',
  EDITOR: 'editor',
  PLAYTEST: 'playtest',
}

// helpful resources
// https://github.com/edemaine/comingle/blob/726d42e975307beb5281fddbf576591c36c1022d/client/Room.coffee#L365-L384
// https://github.com/caplin/FlexLayout/blob/master/examples/demo/App.tsx

const Context = createContext({
  inspectorData: {},
  textEditorData: {},
  createModel: () => { },
  currentModel: {},
  currentRef: {},
  setCurrentRef: () => { },
  saveInspector: () => { },
  saveTextEditor: () => { },
  createOrFocus: () => { },
  addWindow: () => { },
  windowTypes: {},
  workspaceMap: {},
  getWorkspace: () => { },
})

export const useLayout = () => useContext(Context)

const LayoutProvider = ({ children, tab }) => {
  const { subscribe, publish, events } = usePubSub()

  const [saveSpell] = useSaveSpellMutation()
  const { data: spell } = useGetSpellQuery(tab.spell, {
    skip: !tab.spell,
  })
  const currentModelRef = useRef({})

  const [currentModel, setCurrentModel] = useState(null)
  const [currentRef, setCurrentRef] = useState(null)
  const [inspectorData, setInspectorData] = useState(null)
  const [textEditorData, setTextEditorData] = useState({})

  const updateCurrentModel = model => {
    currentModelRef.current = model
    setCurrentModel(model)
  }

  useEffect(() => {
    window.getLayout = () => currentModelRef.current.toJson()
  }, [currentModel])

  // inspector subscription
  useEffect(() => {
    return subscribe(events.$INSPECTOR_SET(tab.id), (event, data) => {
      if (data?.nodeId !== inspectorData?.nodeId) setInspectorData({})
      setInspectorData(data)

      if (!data.dataControls) return

      // Handle components in a special way here.  Could probaby abstract this better

      Object.entries(data.dataControls).forEach(([, control]) => {
        if (control?.options?.editor) {
          // we relay data to the text editor component for display here as well.
          const textData = {
            data: data.data[control.dataKey],
            nodeId: data.nodeId,
            name: data.name,
            control: control,
            options: control.options,
          }

          setTextEditorData(textData)
        }
      })
    })
  }, [events, subscribe, publish])

  // text editor subscription
  useEffect(() => {
    return subscribe(events.$TEXT_EDITOR_SET(tab.id), (event, data) => {
      setTextEditorData(data)
    })
  }, [events, subscribe, publish])

  // clear text editor subscription
  useEffect(() => {
    return subscribe(events.$TEXT_EDITOR_CLEAR(tab.id), () => {
      setTextEditorData({})
    })
  }, [events, subscribe, publish])

  const saveTextEditor = textData => {
    const textUpdate = {
      [textData.control.dataKey]: textData.data,
    }

    const update = {
      ...inspectorData,
      data: {
        ...inspectorData.data,
        ...textUpdate,
      },
    }

    publish(events.$NODE_SET(tab.id, textData.nodeId), update)
    if (inspectorData) {
      setInspectorData(update)
    }
    // saveSpell(spell)
  }

  const saveInspector = inspectorData => {
    setInspectorData(inspectorData)
    publish(events.$NODE_SET(tab.id, inspectorData.nodeId), inspectorData)
    // saveSpell(spell)
  }

  const createModel = json => {
    const model = Model.fromJson(json)
    updateCurrentModel(model)

    return model
  }

  const addWindow = (componentType, title) => {
    // Solution partly taken from here.
    // Programatic creation of a tabSet and a tab added to it.
    // https://github.com/caplin/FlexLayout/issues/54
    const tabJson = {
      type: 'tab',
      component: componentType,
      weight: 12,
      name: title,
    }
    const currentModel = currentModelRef.current

    const rootNode = currentModel.getRoot()
    const tabNode = new TabNode(currentModel, tabJson)
    const tabSetNode = new TabSetNode(currentModel, {
      type: 'tabset',
      weight: 12,
    })

    rootNode._addChild(tabSetNode)

    currentModel.doAction(
      Actions.moveNode(
        tabNode.getId(),
        tabSetNode.getId(),
        DockLocation.RIGHT,
        0
      )
    )
  }

  const createOrFocus = (componentName, title) => {
    const component = Object.entries(currentModelRef.current._idMap).find(
      ([, value]) => {
        return value._attributes?.component === componentName
      }
    )

    // the nodeId is stored in the zeroth index of the find
    if (component) currentModel.doAction(Actions.selectTab(component[0]))
    if (!component) addWindow(componentName, title)
  }

  const publicInterface = {
    inspectorData,
    textEditorData,
    saveTextEditor,
    saveInspector,
    currentModel,
    createModel,
    createOrFocus,
    windowTypes,
    currentRef,
    setCurrentRef,
  }

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

export const Layout = ({ json, factory, tab }) => {
  const { currentModel, createModel, setCurrentRef } = useLayout()
  const { saveTabLayout } = useTabManager()
  const layoutRef = useRef(null)

  useEffect(() => {
    if (!json || currentModel) return
    createModel(json)
  }, [json, createModel, currentModel])

  useEffect(() => {
    setCurrentRef(layoutRef)
  }, [layoutRef, setCurrentRef])

  const onModelChange = () => {
    saveTabLayout(tab.id, currentModel.toJson())
  }

  if (!currentModel) return <LoadingScreen />

  return (
    <LayoutComponent
      onModelChange={onModelChange}
      ref={layoutRef}
      model={currentModel}
      factory={factory}
      font={{ size: '12px', fontFamily: 'IBM Plex Sans' }}
    />
  )
}

export default LayoutProvider
