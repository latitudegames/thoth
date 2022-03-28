import { useEffect, useRef } from 'react'

import { diff } from '../../utils/json0'
import { useEditor } from '@/workspaces/contexts/EditorProvider'
import { Layout } from '@/workspaces/contexts/LayoutProvider'
import { useLazyGetSpellQuery, useSaveDiffMutation } from '@/state/api/spells'
import { debounce } from '@/utils/debounce'
import EditorWindow from './windows/EditorWindow/'
import EventHandler from '@/screens/Thoth/components/EventHandler'
import Inspector from './windows/InspectorWindow'
import Playtest from './windows/PlaytestWindow'
import StateManager from '@/workspaces/spells/windows/StateManagerWindow'
import TextEditor from './windows/TextEditorWindow'
import DebugConsole from './windows/DebugConsole'
import { Spell } from '../../state/api/spells'
import { useSnackbar } from 'notistack'

const Workspace = ({ tab, tabs, pubSub }) => {
  const spellRef = useRef<Spell>()
  const { enqueueSnackbar } = useSnackbar()
  const [loadSpell, { data: spellData }] = useLazyGetSpellQuery()
  const [saveDiff] = useSaveDiffMutation()
  const { editor } = useEditor()

  // Set up autosave for the workspaces
  useEffect(() => {
    if (!editor?.on) return
    const unsubscribe = editor.on(
      'save nodecreated noderemoved connectioncreated connectionremoved nodetranslated',
      debounce(async data => {
        if (tab.type === 'spell' && spellRef.current) {
          const jsonDiff = diff(spellRef.current?.chain, editor.toJSON())

          const response = await saveDiff({
            name: spellRef.current.name,
            diff: jsonDiff,
          })

          if ('error' in response) {
            enqueueSnackbar('Error saving spell', {
              variant: 'error',
            })
          }
        }
      }, 500)
    )

    return unsubscribe as () => void
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
