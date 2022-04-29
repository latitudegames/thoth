import { useEffect, useRef } from 'react'
import { GraphData, Spell } from '@latitudegames/thoth-core/types'

import {
  uniqueNamesGenerator,
  adjectives,
  colors,
} from 'unique-names-generator'

import {
  useSaveSpellMutation,
  useGetSpellQuery,
  useSaveDiffMutation,
} from '../../../state/api/spells'
import { useLayout } from '../../../workspaces/contexts/LayoutProvider'
import { useEditor } from '../../../workspaces/contexts/EditorProvider'
import { diff } from '@/utils/json0'
import { useSnackbar } from 'notistack'
import { sharedb } from '@/config'
import { useSharedb } from '@/contexts/SharedbProvider'

// Config for unique name generator
const customConfig = {
  dictionaries: [adjectives, colors],
  separator: ' ',
  length: 2,
}

const EventHandler = ({ pubSub, tab }) => {
  // only using this to handle events, so not rendering anything with it.
  const { createOrFocus, windowTypes } = useLayout()
  const { enqueueSnackbar } = useSnackbar()
  const { getSpellDoc } = useSharedb()

  const [saveSpellMutation] = useSaveSpellMutation()
  const [saveDiff] = useSaveDiffMutation()
  const { data: spell } = useGetSpellQuery(tab.spellId)

  // Spell ref because callbacks cant hold values from state without them
  const spellRef = useRef<Spell | null>(null)

  useEffect(() => {
    if (!spell) return
    spellRef.current = spell
  }, [spell])

  const { serialize, getEditor, undo, redo, del } = useEditor()

  const { events, subscribe } = pubSub

  const {
    $DELETE,
    $UNDO,
    $REDO,
    $SAVE_SPELL,
    $SAVE_SPELL_DIFF,
    $CREATE_STATE_MANAGER,
    $CREATE_SEARCH_CORPUS,
    $CREATE_ENT_MANAGER,
    $CREATE_PLAYTEST,
    $CREATE_INSPECTOR,
    $CREATE_CONSOLE,
    $CREATE_EVENT_MANAGER,
    $CREATE_TEXT_EDITOR,
    $SERIALIZE,
    $EXPORT,
    $CLOSE_EDITOR,
    $PROCESS,
  } = events

  const saveSpell = async () => {
    const currentSpell = spellRef.current
    const graph = serialize() as GraphData

    await saveSpellMutation({ ...currentSpell, graph })
  }

  const sharedbDiff = async (event, update) => {
    if (!spellRef.current) return
    const doc = getSpellDoc(spellRef.current as Spell)
    if (!doc) return

    const updatedSpell = {
      ...doc.data,
      ...update,
    }

    const jsonDiff = diff(doc.data, updatedSpell)

    if (jsonDiff.length === 0) return

    console.log('JSON DIFF IN SHAREDB DIFF', jsonDiff)

    doc.submitOp(jsonDiff)
  }

  const onSaveDiff = async (event, update) => {
    if (!spellRef.current) return

    const currentSpell = spellRef.current
    const updatedSpell = {
      ...currentSpell,
      ...update,
    }
    const jsonDiff = diff(currentSpell, updatedSpell)

    // no point saving if nothing has changed
    if (jsonDiff.length === 0) return

    const response = await saveDiff({
      name: currentSpell.name,
      diff: jsonDiff,
    })

    if ('error' in response) {
      enqueueSnackbar('Error saving spell', {
        variant: 'error',
      })
      return
    }

    enqueueSnackbar('Spell saved', {
      variant: 'success',
    })
  }

  const createStateManager = () => {
    createOrFocus(windowTypes.STATE_MANAGER, 'State Manager')
  }

  const createSearchCorpus = () => {
    createOrFocus(windowTypes.SEARCH_CORPUS, 'Search Corpus')
  }

  const createEntityManager = () => {
    createOrFocus(windowTypes.ENT_MANAGER, 'Ent Manager')
  }

  const createPlaytest = () => {
    createOrFocus(windowTypes.PLAYTEST, 'Playtest')
  }

  const createInspector = () => {
    createOrFocus(windowTypes.INSPECTOR, 'Inspector')
  }

  const createTextEditor = () => {
    createOrFocus(windowTypes.TEXT_EDITOR, 'Text Editor')
  }

  const createConsole = () => {
    createOrFocus(windowTypes.CONSOLE, 'Console')
  }
  
  const createEventManager = () => {
    createOrFocus(windowTypes.EVENT_MANAGER, 'Event Manager')
  }

  const onSerialize = () => {
    // eslint-disable-next-line no-console
    console.log(serialize())
  }

  const onProcess = () => {
    const editor = getEditor()
    if (!editor) return

    editor.runProcess()
  }

  const onUndo = () => {
    undo()
  }

  const onRedo = () => {
    redo()
  }

  const onDelete = () => {
    del()
  }

  const onExport = async () => {
    // refetch spell from local DB to ensure it is the most up to date
    const spell = { ...spellRef.current }
    spell.graph = serialize() as GraphData
    spell.name = uniqueNamesGenerator(customConfig)

    const json = JSON.stringify(spell)

    const blob = new Blob([json], { type: 'application/json' })
    const url = window.URL.createObjectURL(new Blob([blob]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${spell.name}.thoth`)

    // Append to html link element page
    document.body.appendChild(link)

    // Start download
    link.click()

    if (!link.parentNode) return

    // Clean up and remove the link
    link.parentNode.removeChild(link)
  }

  // clean up anything inside the editor which we need to shut down.
  // mainly subscriptions, etc.
  const onCloseEditor = () => {
    const editor = getEditor() as Record<string, any>
    if (editor.moduleSubscription) editor.moduleSubscription.unsubscribe()
  }

  const handlerMap = {
    [$SAVE_SPELL(tab.id)]: saveSpell,
    [$CREATE_STATE_MANAGER(tab.id)]: createStateManager,
    [$CREATE_SEARCH_CORPUS(tab.id)]: createSearchCorpus,
    [$CREATE_ENT_MANAGER(tab.id)]: createEntityManager,
    [$CREATE_PLAYTEST(tab.id)]: createPlaytest,
    [$CREATE_INSPECTOR(tab.id)]: createInspector,
    [$CREATE_TEXT_EDITOR(tab.id)]: createTextEditor,
    [$CREATE_CONSOLE(tab.id)]: createConsole,
    [$CREATE_EVENT_MANAGER(tab.id)]: createEventManager,
    [$SERIALIZE(tab.id)]: onSerialize,
    [$EXPORT(tab.id)]: onExport,
    [$CLOSE_EDITOR(tab.id)]: onCloseEditor,
    [$UNDO(tab.id)]: onUndo,
    [$REDO(tab.id)]: onRedo,
    [$DELETE(tab.id)]: onDelete,
    [$PROCESS(tab.id)]: onProcess,
    [$SAVE_SPELL_DIFF(tab.id)]: sharedb ? sharedbDiff : onSaveDiff,
  }

  useEffect(() => {
    if (!tab && !spell) return

    const subscriptions = Object.entries(handlerMap).map(([event, handler]) => {
      return subscribe(event, handler)
    })

    // unsubscribe from all subscriptions on unmount
    return () => {
      subscriptions.forEach(unsubscribe => {
        unsubscribe()
      })
    }
  }, [tab])

  return null
}

export default EventHandler
