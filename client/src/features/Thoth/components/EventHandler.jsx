import { useEffect } from 'react'

import { useEditor } from '../../../contexts/EditorProvider'
import { useLayout } from '../../../contexts/LayoutProvider'
import { useModule } from '../../../contexts/ModuleProvider'
import { useSpell } from '../../../contexts/SpellProvider'

const EventHandler = ({ pubSub, tab }) => {
  // only using this to handle events, so not rendering anything with it.
  const { createOrFocus, windowTypes } = useLayout()

  const { serialize, getEditor, undo, redo } = useEditor()
  const { saveCurrentSpell, getSpell, getCurrentSpell } = useSpell()
  const { getSpellModules } = useModule()

  const { events, subscribe } = pubSub

  const {
    $UNDO,
    $REDO,
    $SAVE_SPELL,
    $CREATE_STATE_MANAGER,
    $CREATE_PLAYTEST,
    $CREATE_INSPECTOR,
    $CREATE_TEXT_EDITOR,
    $SERIALIZE,
    $EXPORT,
    $CLOSE_EDITOR,
  } = events

  const saveSpell = async () => {
    const graph = serialize()
    await saveCurrentSpell({ graph })
  }

  const createStateManager = () => {
    createOrFocus(windowTypes.STATE_MANAGER, 'State Manager')
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

  const onSerialize = () => {
    // eslint-disable-next-line no-console
    console.log(serialize())
  }

  const onUndo = () => {
    undo()
  }

  const onRedo = () => {
    redo()
  }

  const onExport = async () => {
    const currentSpell = getCurrentSpell()
    // refetch spell from local DB to ensure it is the most up to date
    const spellDoc = await getSpell(currentSpell.name)
    const spell = spellDoc.toJSON()
    const modules = await getSpellModules(spell)
    // attach modules to spell to be exported
    spell.modules = modules

    const json = JSON.stringify(spell)

    const blob = new Blob([json], { type: 'application/json' })
    const url = window.URL.createObjectURL(new Blob([blob]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${spellDoc.name}.thoth`)

    // Append to html link element page
    document.body.appendChild(link)

    // Start download
    link.click()

    // Clean up and remove the link
    link.parentNode.removeChild(link)
  }

  // clean up anything inside the editor which we need to shut down.
  // mainly subscriptions, etc.
  const onCloseEditor = () => {
    const editor = getEditor()
    if (editor.moduleSubscription) editor.moduleSubscription.unsubscribe()
  }

  const handlerMap = {
    [$SAVE_SPELL(tab.id)]: saveSpell,
    [$CREATE_STATE_MANAGER(tab.id)]: createStateManager,
    [$CREATE_PLAYTEST(tab.id)]: createPlaytest,
    [$CREATE_INSPECTOR(tab.id)]: createInspector,
    [$CREATE_TEXT_EDITOR(tab.id)]: createTextEditor,
    [$SERIALIZE(tab.id)]: onSerialize,
    [$EXPORT(tab.id)]: onExport,
    [$CLOSE_EDITOR(tab.id)]: onCloseEditor,
    [$UNDO(tab.id)]: onUndo,
    [$REDO(tab.id)]: onRedo,
  }

  useEffect(() => {
    if (!tab) return

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
