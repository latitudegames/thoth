import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import {
  uniqueNamesGenerator,
  adjectives,
  colors,
} from 'unique-names-generator'

import {
  useSaveSpellMutation,
  useGetSpellsQuery,
  selectSpellById,
} from '../../state/api/spells'
import { useEditor } from '../contexts/EditorProvider'
import { useLayout } from '../contexts/LayoutProvider'
import { useModule } from '../../contexts/ModuleProvider'

// Config for unique name generator
const customConfig = {
  dictionaries: [adjectives, colors],
  separator: ' ',
  length: 2,
}

const EventHandler = ({ pubSub, tab }) => {
  // only using this to handle events, so not rendering anything with it.
  const { createOrFocus, windowTypes } = useLayout()

  const [saveSpellMutation] = useSaveSpellMutation()
  const { data: spellsData } = useGetSpellsQuery()
  const spell = useSelector(state => selectSpellById(state, tab?.spell))

  // Spell ref because callbacks cant hold values from state without them
  const spellRef = useRef(null)
  useEffect(() => {
    if (!spell) return
    spellRef.current = spell
  }, [spell])

  const { serialize, getEditor, undo, redo } = useEditor()
  const { getSpellModules } = useModule()

  const { events, subscribe } = pubSub

  const {
    $UNDO,
    $REDO,
    $SAVE_SPELL,
    $SAVE_SPELL_AS,
    $CREATE_STATE_MANAGER,
    $CREATE_AGENT_MANAGER,
    $CREATE_SEARCH_CORPUS,
    $CREATE_ENT_MANAGER,
    $CREATE_CONFIG_MANAGER,
    $CREATE_PLAYTEST,
    $CREATE_INSPECTOR,
    $CREATE_TEXT_EDITOR,
    $SERIALIZE,
    $EXPORT,
    $CLOSE_EDITOR,
  } = events

  const saveSpell = async () => {
    const currentSpell = spellRef.current
    const chain = serialize(currentSpell)

    await saveSpellMutation({ ...currentSpell, chain })
  }

  const saveSpellAs = async () => {
    console.log('Save spell as')
  }

  const createStateManager = () => {
    createOrFocus(windowTypes.STATE_MANAGER, 'State Manager')
  }

  const createAgentManager = () => {
    createOrFocus(windowTypes.AGENT_MANAGER, 'Agent Manager')
  }

  const createSearchCorpus = () => {
    createOrFocus(windowTypes.SEARCH_CORPUS, 'Search Corpus')
  }

  const createConfigManager = () => {
    createOrFocus(windowTypes.CONFIG_MANAGER, 'Config Manager')
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
    // refetch spell from local DB to ensure it is the most up to date
    const spell = { ...spellRef.current }
    spell.chain = serialize()
    const modules = await getSpellModules(spell)
    // attach modules to spell to be exported
    spell.modules = modules
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
    [$CREATE_AGENT_MANAGER(tab.id)]: createAgentManager,
    [$CREATE_SEARCH_CORPUS(tab.id)]: createSearchCorpus,
    [$CREATE_ENT_MANAGER(tab.id)]: createEntityManager,
    [$CREATE_CONFIG_MANAGER(tab.id)]: createConfigManager,
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
