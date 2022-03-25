import { useContext, createContext, useRef, useEffect } from 'react'

import { postEnkiCompletion } from '../../services/game-api/enki'
import { completion as _completion } from '../../services/game-api/text'
import { invokeInference } from '../../utils/huggingfaceHelper'
import { useDB } from '../../contexts/DatabaseProvider'
import { usePubSub } from '../../contexts/PubSubProvider'
import { useFetchFromImageCacheMutation } from '@/state/api/visualGenerationsApi'
import { ModelsType } from '../../types'
import { ThothWorkerInputs } from '@latitudegames/thoth-core/types'
import {
  Spell,
  useGetSpellQuery,
  useSaveSpellMutation,
} from '@/state/api/spells'
import { EngineContext } from '@latitudegames/thoth-core/src/engine'

/*
Some notes here.  The new rete provider, not to be confused with the old rete provider renamed to the editor provider, is designed to serve as the single source of truth for interfacing with the rete internal system.  This unified interface will also allow us to replicate the same API in the server, where rete expects certain functions to exist but doesn't care what is behind these functions so long as they work.
Not all functions will be needed on the server, and functions which are not will be labeled as such.
*/

export interface ThothInterfaceContext extends EngineContext {
  onInspector: (node, callback) => void
  onPlaytest: (callback) => void
  sendToPlaytest: (data) => void
  sendToInspector: (data) => void
  sendToDebug: (data) => void
  onDebug: (node, callback) => void
  clearTextEditor: () => void
  getSpell: Function
  getModule: Function
  getModules: Function
  getCurrentGameState: () => Record<string, unknown>
  updateCurrentGameState: (update) => void
  readFromImageCache: (caption, cacheTag, topK) => Promise<Record<string, any>>
  processCode: (
    code: unknown,
    inputs: ThothWorkerInputs,
    data: Record<string, any>
  ) => void
}

const Context = createContext<ThothInterfaceContext>(undefined!)

export const useThothInterface = () => useContext(Context)

const ReteProvider = ({ children, tab }) => {
  const { events, publish, subscribe } = usePubSub()
  const spellRef = useRef<Spell | null>(null)
  const [fetchFromImageCache] = useFetchFromImageCacheMutation()
  const [saveSpell] = useSaveSpellMutation()
  const { data: _spell } = useGetSpellQuery(tab.spell, {
    skip: !tab.spell,
  })

  useEffect(() => {
    if (!_spell) return
    spellRef.current = _spell
  }, [_spell])

  const { models } = useDB() as unknown as ModelsType

  const {
    $PLAYTEST_INPUT,
    $PLAYTEST_PRINT,
    $INSPECTOR_SET,
    $DEBUG_PRINT,
    $DEBUG_INPUT,
    $TEXT_EDITOR_CLEAR,
    $NODE_SET,
    ADD_MODULE,
    UPDATE_MODULE,
    $MODULE_UPDATED,
  } = events

  const onInspector = (node, callback) => {
    return subscribe($NODE_SET(tab.id, node.id), (event, data) => {
      callback(data)
    })
  }

  const onAddModule = callback => {
    return subscribe(ADD_MODULE, (event, data) => {
      callback(data)
    })
  }

  const onUpdateModule = callback => {
    return subscribe(UPDATE_MODULE, (event, data) => {
      callback(data)
    })
  }

  const onModuleUpdated = (moduleName, callback) => {
    return subscribe($MODULE_UPDATED(moduleName), (event, data) => {
      callback(data)
    })
  }

  const onDeleteModule = callback => {
    return subscribe(UPDATE_MODULE, (event, data) => {
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
      callback(data)
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
    if ('error' in result) return {}
    return result.data
  }

  const processCode = (code, inputs, data) => {
    const flattenedInputs = Object.entries(inputs as ThothWorkerInputs).reduce(
      (acc, [key, value]) => {
        acc[key as string] = value[0]
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

  const clearTextEditor = () => {
    publish($TEXT_EDITOR_CLEAR(tab.id))
  }

  const getCurrentGameState = () => {
    if (!spellRef.current) return {}

    return spellRef.current?.gameState ?? {}
  }

  const updateCurrentGameState = update => {
    if (!spellRef.current) return
    const spell = spellRef.current

    const newSpell = {
      ...spell,
      gameState: {
        ...spell.gameState,
        ...update,
      },
    }

    saveSpell(newSpell as Spell)
  }

  const publicInterface = {
    onInspector,
    onAddModule,
    onUpdateModule,
    onDeleteModule,
    onModuleUpdated,
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
    ...models.modules,

    // going to need to manuall create theses
    ...models.spells,
  }

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

export default ReteProvider