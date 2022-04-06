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
import { useSnackbar } from 'notistack'
import { Spell } from '@latitudegames/thoth-core/types'
import { usePubSub } from '@/contexts/PubSubProvider'
import SearchCorpus from './windows/SearchCorpusWindow'
import EntityManagerWindow from './windows/EntityManagerWindow'

const Workspace = ({ tab, tabs, pubSub }) => {
  const spellRef = useRef<Spell>()
  const { enqueueSnackbar } = useSnackbar()
  const { events, publish } = usePubSub()
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
          const jsonDiff = diff(spellRef.current?.graph, editor.toJSON())
          console.log("Saving diff", jsonDiff)
          if (jsonDiff == [] || !jsonDiff) return

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
    if (!editor?.on) return

    const unsubscribe = editor.on('nodecreated noderemoved', () => {
      if (!spellRef.current) return
      const event = events.$SUBSPELL_UPDATED(editor.toJSON())
      const spell = {
        ...spellRef.current,
        graph: editor.toJSON(),
      }
      publish(event, spell)
    }) as Function

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
        case 'searchCorpus':
          return <SearchCorpus />
        case 'entityManager':
          return <EntityManagerWindow />
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
