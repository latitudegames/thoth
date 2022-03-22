import { useEffect, useRef } from 'react'

import { useEditor } from '@thoth/contexts/EditorProvider'
import { Layout } from '@thoth/contexts/LayoutProvider'
import { useLazyGetSpellQuery, useSaveSpellMutation } from '@/state/api/spells'
import { debounce } from '@/utils/debounce'
import EditorWindow from '@thoth/windows/EditorWindow'
import EventHandler from '@thoth/components/EventHandler'
import Inspector from '@thoth/windows/InspectorWindow'
import Playtest from '@thoth/windows/PlaytestWindow'
import StateManager from '@thoth/windows/StateManagerWindow'
import TextEditor from '@thoth/windows/TextEditorWindow'
import DebugConsole from '@thoth/windows/DebugConsole'
import { Spell } from '../../../../state/api/spells'

const Workspace = ({ tab, tabs, pubSub }) => {
  const spellRef = useRef<Spell>()
  const [loadSpell, { data: spellData }] = useLazyGetSpellQuery()
  const [saveSpell] = useSaveSpellMutation()
  const { editor } = useEditor()

  // Set up autosave for the workspaces
  useEffect(() => {
    if (!editor?.on) return
    return editor.on(
      'save nodecreated noderemoved connectioncreated connectionremoved nodetranslated',
      debounce(() => {
        if (tab.type === 'spell') {
          saveSpell({ ...spellRef.current, chain: editor.toJSON() })
        }
      }, 500)
    )
  }, [editor])

  useEffect(() => {
    if (!spellData) return
    spellRef.current = spellData
  }, [spellData])

  useEffect(() => {
    if (!tab || !tab.spellId) return
    loadSpell(tab.spellId)
  }, [tab])

  const factory = tab => {
    return node => {
      const props = {
        tab,
        node,
      }
      const component = node.getComponent()
      switch (component) {
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
        case 'debugConsole':
          return <DebugConsole {...props} />
        default:
          return <p></p>
      }
    }
  }

  return (
    <>
      <EventHandler tab={tab} pubSub={pubSub} />
      <Layout json={tab.layoutJson} factory={factory(tab)} tab={tab} />
    </>
  )
}

const Wrapped = props => {
  return <Workspace {...props} />
}

export default Wrapped
