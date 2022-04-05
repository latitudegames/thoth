import { useEffect, useRef, useState } from 'react'

import { useEditor } from '@/workspaces/contexts/EditorProvider'
import { Layout } from '@/workspaces/contexts/LayoutProvider'
import { useLazyGetSpellQuery } from '@/state/api/spells'
import { debounce } from '@/utils/debounce'
import EditorWindow from './windows/EditorWindow/'
import EventHandler from '@/screens/Thoth/components/EventHandler'
import Inspector from './windows/InspectorWindow'
import Playtest from './windows/PlaytestWindow'
import StateManager from '@/workspaces/spells/windows/StateManagerWindow'
import TextEditor from './windows/TextEditorWindow'
import DebugConsole from './windows/DebugConsole'
import { Spell } from '@latitudegames/thoth-core/types'
import { usePubSub } from '@/contexts/PubSubProvider'
import { useSharedb } from '@/contexts/SharedbProvider'
import { sharedb } from '@/config'
import { diff } from '@/utils/json0'

const Workspace = ({ tab, tabs, pubSub }) => {
  const spellRef = useRef<Spell>()
  const { events, publish } = usePubSub()
  const { getSpellDoc } = useSharedb()
  const [loadSpell, { data: spellData }] = useLazyGetSpellQuery()
  const { serialize, editor } = useEditor()

  const [docLoaded, setDocLoaded] = useState<boolean>(false)

  // Set up autosave for the workspaces
  useEffect(() => {
    if (!editor?.on) return

    const unsubscribe = editor.on(
      'save nodecreated noderemoved connectioncreated connectionremoved nodetranslated commentremoved commentcreated addcomment removecomment editcomment connectionpath',
      debounce(async data => {
        if (tab.type === 'spell' && spellRef.current) {
          publish(events.$SAVE_SPELL_DIFF(tab.id), { chain: serialize() })
        }
      }, 1000)
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
        chain: editor.toJSON(),
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
    if (!spellData || !sharedb || docLoaded || !editor) return

    const doc = getSpellDoc(spellData as Spell)

    if (!doc) return

    console.log('SUBSCRIBING TO CHANGES')
    doc.on('op', (op, origin) => {
      if (origin) return
      console.log('updating graph')
      const jsonDiff = diff(spellData.chain, doc.data.chain)
      if (jsonDiff.length > 0) {
        console.log('UPDATED CHAIN', spellData.chain)
        editor.loadGraph(doc.data.chain, true)
      }
    })

    setDocLoaded(true)
  }, [spellData, editor])

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
