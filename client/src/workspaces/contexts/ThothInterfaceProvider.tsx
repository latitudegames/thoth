import {
  EditorContext,
  Spell,
  ThothWorkerInputs,
} from '@latitudegames/thoth-core/types'
import { useContext, createContext, useRef, useEffect } from 'react'

import { postEnkiCompletion } from '../../services/game-api/enki'
import { completion as _completion } from '../../services/game-api/text'
import { invokeInference } from '../../utils/huggingfaceHelper'
import { usePubSub } from '../../contexts/PubSubProvider'
import { useFetchFromImageCacheMutation } from '@/state/api/visualGenerationsApi'
import { useGetSpellQuery, useRunSpellMutation } from '@/state/api/spells'

/*
Some notes here.  The new rete provider, not to be confused with the old rete provider renamed to the editor provider, is designed to serve as the single source of truth for interfacing with the rete internal system.  This unified interface will also allow us to replicate the same API in the server, where rete expects certain functions to exist but doesn't care what is behind these functions so long as they work.
Not all functions will be needed on the server, and functions which are not will be labeled as such.
*/

const Context = createContext<EditorContext>(undefined!)

export const useThothInterface = () => useContext(Context)

const ThothInterfaceProvider = ({ children, tab }) => {
  const { events, publish, subscribe } = usePubSub()
  const spellRef = useRef<Spell | null>(null)
  const [fetchFromImageCache] = useFetchFromImageCacheMutation()
  const [_runSpell] = useRunSpellMutation()
  const { data: _spell } = useGetSpellQuery(tab.spellId, {
    skip: !tab.spellId,
  })

  useEffect(() => {
    if (!_spell) return
    spellRef.current = _spell
  }, [_spell])

  const {
    $PLAYTEST_INPUT,
    $PLAYTEST_PRINT,
    $INSPECTOR_SET,
    $DEBUG_PRINT,
    $DEBUG_INPUT,
    $TEXT_EDITOR_CLEAR,
    $SAVE_SPELL_DIFF,
    $NODE_SET,
    ADD_SUBSPELL,
    UPDATE_SUBSPELL,
    $SUBSPELL_UPDATED,
    $PROCESS,
  } = events

  const onInspector = (node, callback) => {
    return subscribe($NODE_SET(tab.id, node.id), (event, data) => {
      callback(data)
    })
  }

  const onAddModule = callback => {
    return subscribe(ADD_SUBSPELL, (event, data) => {
      callback(data)
    })
  }

  const onUpdateModule = callback => {
    return subscribe(UPDATE_SUBSPELL, (event, data) => {
      callback(data)
    })
  }

  const onSubspellUpdated = (spellId: string, callback: Function) => {
    return subscribe($SUBSPELL_UPDATED(spellId), (event, data) => {
      callback(data)
    })
  }

  const onDeleteModule = callback => {
    return subscribe(UPDATE_SUBSPELL, (event, data) => {
      callback(data)
    })
  }

  const sendToInspector = data => {
    publish($INSPECTOR_SET(tab.id), data)
  }

  const sendToDebug = data => {
    publish($DEBUG_PRINT(tab.id), data)
  }

  const onDebug = (node, callback) => {
    return subscribe($DEBUG_INPUT(tab.id, node.id), (event, data) => {
      callback(data)
    })
  }

  const sendToPlaytest = data => {
    publish($PLAYTEST_PRINT(tab.id), data)
  }

  const onPlaytest = callback => {
    return subscribe($PLAYTEST_INPUT(tab.id), (event, data) => {
      publish($PROCESS(tab.id))
      // weird hack.  This staggers the process slightly to allow the published event to finish before the callback runs.
      // No super elegant, but we need a better more centralised way to run the engine than these callbacks.
      setTimeout(() => callback(data), 0)
    })
  }

  const completion = async body => {
    const result = await _completion(body)
    return result
  }

  const enkiCompletion = async (taskName, inputs) => {
    const result = await postEnkiCompletion(taskName, inputs)
    return result
  }

  const huggingface = async (model, data) => {
    const result = await invokeInference(model, data)
    return result
  }

  const readFromImageCache = async (caption, cacheTag, topK) => {
    const result = await fetchFromImageCache({
      caption,
      cacheTag,
      topK,
    })
    if ('error' in result) throw new Error('Error reading from image cache')
    return result.data
  }

  const processCode = (code, inputs, data) => {
    const flattenedInputs = Object.entries(inputs as ThothWorkerInputs).reduce(
      (acc, [key, value]) => {
        // @ts-ignore
        acc[key as string] = value[0] as any
        return acc
      },
      {} as Record<string, any>
    )
    // eslint-disable-next-line no-new-func
    return Function('"use strict";return (' + code + ')')()(
      flattenedInputs,
      data
    )
  }

  const runSpell = async (inputs, spellId) => {
    console.log('RUN SPELL')
    const response = await _runSpell({ inputs, spellId })

    if ('error' in response) {
      throw new Error(`Error running spell ${spellId}`)
    }

    return response.data.outputs
  }

  const clearTextEditor = () => {
    publish($TEXT_EDITOR_CLEAR(tab.id))
  }

  const getCurrentGameState = () => {
    if (!spellRef.current) return {}

    return spellRef.current?.gameState ?? {}
  }

  const updateCurrentGameState = _update => {
    if (!spellRef.current) return
    const spell = spellRef.current

    // lets delete out all undefined properties coming in
    Object.keys(_update).forEach(
      key => _update[key] === undefined && delete _update[key]
    )

    const update = {
      gameState: {
        ...spell.gameState,
        ..._update,
      },
    }

    publish($SAVE_SPELL_DIFF(tab.id), update)
  }

  const publicInterface = {
    onInspector,
    onAddModule,
    onUpdateModule,
    onDeleteModule,
    onSubspellUpdated,
    sendToInspector,
    sendToDebug,
    onDebug,
    sendToPlaytest,
    onPlaytest,
    clearTextEditor,
    completion,
    enkiCompletion,
    huggingface,
    readFromImageCache,
    getCurrentGameState,
    updateCurrentGameState,
    processCode,
    runSpell,
  }

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

export default ThothInterfaceProvider