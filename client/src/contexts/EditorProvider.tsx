import { initEditor } from '@latitudegames/thoth-core'
import React, {
  useRef,
  useContext,
  createContext,
  useState,
  useEffect,
} from 'react'

import { useLazyGetSpellQuery, Spell } from '../state/spells'

import LoadingScreen from '../features/common/LoadingScreen/LoadingScreen'
import { MyNode } from '../features/common/Node/Node'
import gridimg from '../grid.png'
import { useSpell } from './SpellProvider'
import { usePubSub } from './PubSubProvider'
import { useRete, ReteContext } from './ReteProvider'
// import { ThothTab } from './TabManagerProvider'

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
  serialize: () => {},
  buildEditor: (
    el: HTMLDivElement,
    // todo update this to use proper spell type
    spell: Spell | undefined,
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
    // eslint-disable-next-line no-console
    console.log('building editor for tab', tab)
    const newEditor = await initEditor({
      container,
      pubSub,
      // calling thoth during migration of features
      thoth,
      tab,
      // MyNode is a custom default style for nodes
      node: MyNode,
    })

    // set editor to the map
    setEditor(newEditor)

    if (tab.type === 'spell') newEditor.loadGraph(spell.graph)

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

const RawEditor = ({ tab, children }) => {
  const [getSpell, { data: spell, isLoading }] = useLazyGetSpellQuery()
  const [loaded, setLoaded] = useState(false)
  const { buildEditor } = useEditor()
  const { getCurrentGameState, updateCurrentGameState } = useSpell()
  // This will be the main interface between thoth and rete
  const reteInterface = useRete()

  useEffect(() => {
    if (!tab) return

    getSpell(tab.spell)
  }, [tab])

  if (isLoading || !tab || !spell) return <LoadingScreen />

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

export const Editor = React.memo(RawEditor)

Editor.whyDidYouRender = false

export default EditorProvider
