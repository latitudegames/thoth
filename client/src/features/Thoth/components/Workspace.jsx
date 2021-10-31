import { useEffect } from 'react'

import { store } from '../../../state/store'
import { Editor, useEditor } from '../../../contexts/EditorProvider'
import { Layout } from '../../../contexts/LayoutProvider'
import { useModule } from '../../../contexts/ModuleProvider'
import {
  useLazyGetSpellQuery,
  useSaveSpellMutation,
  selectSpellsByModuleName,
  selectSpellById,
} from '../../../state/api/spells'
import WorkspaceProvider from '../../../contexts/WorkspaceProvider'
import { debounce } from '../../../utils/debounce'
import EditorWindow from './EditorWindow'
import EventHandler from './EventHandler'
import Inspector from './InspectorWindow'
import Playtest from './PlaytestWindow'
import StateManager from './StateManagerWindow'
import TextEditor from '../windows/TextEditorWindow'

const Workspace = ({ tab, tabs, appPubSub }) => {
  const [loadSpell, { data: spellData }] = useLazyGetSpellQuery()
  const [saveSpell] = useSaveSpellMutation()
  const { saveModule } = useModule()
  const { editor } = useEditor()

  // Set up autosave for the workspace
  useEffect(() => {
    if (!editor?.on) return
    return editor.on(
      'save nodecreated noderemoved connectioncreated connectionremoved nodetranslated',
      debounce(() => {
        if (tab.type === 'spell') {
          saveSpell({ ...spellData, chain: editor.toJSON() }, false)
        }
        if (tab.type === 'module') {
          saveModule(tab.module, { data: editor.toJSON() }, false)
          // when a module is saved, we look for any open spell tabs, and check if they have the module.
          /// if they do, we trigger a save to ensure the module change is captured to the server
          tabs
            .filter(tab => tab.type === 'spell')
            .forEach(filteredTab => {
              if (filteredTab.spell) {
                const spell = selectSpellById(
                  store.getState(),
                  filteredTab.spell
                )
                if (spell?.modules.some(module => module.name === tab.module))
                  saveSpell({ ...spell })
              }
            })
        }
      }, 500)
    )
  }, [editor])

  useEffect(() => {
    if (!tab || !tab.spell) return
    loadSpell(tab.spell, { refetchOnMountOrArgChange: true })
  }, [tab])

  const factory = tab => {
    return node => {
      const props = {
        tab,
        node,
      }
      const component = node.getComponent()
      switch (component) {
        case 'editor':
          return <Editor {...props} />
        case 'stateManager':
          return <StateManager {...props} />
        case 'playtest':
          return <Playtest {...props} />
        case 'inspector':
          return <Inspector {...props} />
        case 'textEditor':
          return <TextEditor {...props} />
        case 'editorWindow':
          return <EditorWindow {...props} />
        default:
          return <p></p>
      }
    }
  }

  return (
    <div style={{ visibility: !tab.active ? 'hidden' : null, height: '100%' }}>
      <EventHandler tab={tab} pubSub={appPubSub} />
      <Layout json={tab.layoutJson} factory={factory(tab)} tab={tab} />
    </div>
  )
}

const Wrapped = props => {
  return (
    <WorkspaceProvider {...props}>
      <Workspace {...props} />
    </WorkspaceProvider>
  )
}

export default Wrapped
