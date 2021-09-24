import init from '@latitudegames/thoth-core/editor'
import { EngineContext } from '@latitudegames/thoth-core/engine'
import { useRef, useContext, createContext, useState } from 'react'

import LoadingScreen from '../features/common/LoadingScreen/LoadingScreen'
import { MyNode } from '../features/common/Node/Node'
import gridimg from '../grid.png'
import { usePubSub } from './PubSubProvider'
import { useRete } from './ReteProvider'
import { useSpell } from './SpellProvider'

export type SpellContext = {
  currentSpell: {}
  getCurrentSpell: () => void
  updateCurrentSpell: {}
  loadSpell: () => void
  saveSpell: () => void
  newSpell: () => void
  saveCurrentSpell: () => void
  stateHistory: never[]
  currentGameState: {}
  getCurrentGameState: () => Record<string, unknown>
  rewriteCurrentGameState: () => Record<string, unknown>
  updateCurrentGameState: () => void
  getThothVersion: () => void
}

export interface ReteContext extends EngineContext {
  onInspector: () => void
  onPlayTest: () => void
  onGameState: () => void
  sendToPlaytest: () => void
  sendToInspector: () => void
  clearTextEditor: () => void
  getSpell: () => void
  getModule: () => void
  getGameState: () => void
  setGameState: () => void
  getModules: () => void
}

export type ThothTab = {
  layoutJson: string
  name: string
  id: string
  spell: string
  module: string
  type: string
  active: boolean
}

const Context = createContext({
  run: () => {},
  getEditor: () => {},
  editor: {},
  serialize: () => {},
  buildEditor: (
    el: HTMLDivElement,
    spell: SpellContext,
    tab: ThothTab,
    reteInterface: ReteContext
  ) => {},
  setEditor: (editor: any) => {},
  getNodeMap: () => {},
  getNodes: () => {},
  loadGraph: (graph: any) => {},
  setContainer: () => {},
  undo: () => {},
  redo: () => {},
})

export const useEditor = () => useContext(Context)

const EditorProvider = ({ children }) => {
  const [editor, setEditorState] = useState({
    components: [],
    loadGraph: (graph: any) => {},
  })
  const editorRef = useRef({
    trigger: (event: string) => {},
    toJSON: () => {},
  })
  const pubSub = usePubSub()

  const setEditor = editor => {
    editorRef.current = editor
    setEditorState(editor)
  }

  const getEditor = () => {
    return editorRef.current
  }

  const buildEditor = async (container, spell, tab, thoth) => {
    const newEditor = await init({
      container,
      pubSub,
      // calling thothV2 during migration of features
      thothV2: thoth,
      thoth: spell,
      tab,
      // MyNode is a custom default style for nodes
      node: MyNode,
    })

    // set editor to the map
    setEditor(newEditor)

    if (tab.type === 'spell') {
      const spellDoc = await thoth.getSpell(tab.spell)
      newEditor.loadGraph(spellDoc.toJSON().graph)
    }

    if (tab.type === 'module') {
      const moduleDoc = await thoth.getModule(tab.module)
      newEditor.loadGraph(moduleDoc.toJSON().data)
    }
  }

  const run = () => {
    // console.log('RUN')
  }

  const undo = () => {
    editorRef.current.trigger('undo')
  }

  const redo = () => {
    editorRef.current.trigger('redo')
  }

  const serialize = () => {
    return editorRef.current.toJSON()
  }

  const getNodeMap = () => {
    return editor && editor.components
  }

  const getNodes = () => {
    return editor && Object.fromEntries(editor.components)
  }

  const loadGraph = graph => {
    editor.loadGraph(graph)
  }

  const setContainer = () => {
    // console.log('set container')
  }

  const publicInterface = {
    run,
    serialize,
    editor,
    editorRef,
    buildEditor,
    getNodeMap,
    getNodes,
    loadGraph,
    setEditor,
    getEditor,
    undo,
    redo,
    setContainer,
  }

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

export const Editor = ({ tab, children }) => {
  const [loaded, setLoaded] = useState(false)
  const { buildEditor } = useEditor()
  const spell = useSpell()
  const { getCurrentGameState, updateCurrentGameState } = spell
  // This will be the main interface between thoth and rete
  const reteInterface = useRete()

  if (!tab) return <LoadingScreen />

  return (
    <>
      <div
        style={{
          textAlign: 'left',
          width: '100vw',
          height: '100vh',
          position: 'absolute',
          backgroundColor: '#191919',
          backgroundImage: `url('${gridimg}')`,
        }}
        onDragOver={e => {
          e.preventDefault()
        }}
        onDrop={e => {}}
      >
        <div
          ref={el => {
            if (el && !loaded) {
              buildEditor(el, spell, tab, {
                ...reteInterface,
                getCurrentGameState,
                updateCurrentGameState,
              })
              setLoaded(true)
            }
          }}
        />
      </div>
      {children}
    </>
  )
}

export default EditorProvider
