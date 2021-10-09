import { useEffect } from 'react'

import { Editor, useEditor } from '../../../contexts/EditorProvider'
import { Layout } from '../../../contexts/LayoutProvider'
import { useModule } from '../../../contexts/ModuleProvider'
import {
  useLazyGetSpellQuery,
  useSaveSpellMutation,
} from '../../../state/spells'
import WorkspaceProvider from '../../../contexts/WorkspaceProvider'
import { debounce } from '../../../utils/debounce'
import EditorWindow from './EditorWindow'
import EventHandler from './EventHandler'
import Inspector from './InspectorWindow'
import Playtest from './PlaytestWindow'
import StateManager from './StateManagerWindow'
import TextEditor from './TextEditorWindow'

const Workspace = ({ tab, appPubSub }) => {
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
          saveSpell({ ...spellData, graph: editor.toJSON() }, false)
        }
        if (tab.type === 'module') {
          saveModule(tab.module, { data: editor.toJSON() }, false)
        }
      }, 500)
    )
  }, [editor])

  useEffect(() => {
    if (!tab || !tab.spell) return
    loadSpell(tab.spell)
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
