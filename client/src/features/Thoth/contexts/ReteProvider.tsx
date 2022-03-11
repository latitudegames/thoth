// @ts-nocheck
// @ts-nocheck

import { EngineContext } from '@latitudegames/thoth-core'
import { useContext, createContext } from 'react'
import { useDispatch } from 'react-redux'

import { postEnkiCompletion } from '../../../services/game-api/enki'
import { completion as _completion } from '../../../services/game-api/text'
import {
  selectGameStateBySpellId,
  updateGameState,
} from '../../../state/gameState'
import { store } from '../../../state/store'
import { invokeInference } from '../../../utils/huggingfaceHelper'
import { useDB } from '../../../contexts/DatabaseProvider'
import { usePubSub } from '../../../contexts/PubSubProvider'
import { useFetchFromImageCacheMutation } from '@/state/api/visualGenerationsApi'
import { ModelsType } from '../../../types'
/*
Some notes here.  The new rete provider, not to be confused with the old rete provider renamed to the editor provider, is designed to serve as the single source of truth for interfacing with the rete internal system.  This unified interface will also allow us to replicate the same API in the server, where rete expects certain functions to exist but doesn't care what is behind these functions so long as they work.
Not all functions will be needed on the server, and functions which are not will be labeled as such.
*/

export interface ReteContext extends EngineContext {
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
}

const Context = createContext<ReteContext>(undefined!)

export const useRete = () => useContext(Context)

const ReteProvider = ({ children, tab }) => {
  const { events, publish, subscribe } = usePubSub()
  const dispatch = useDispatch()
  const [fetchFromImageCache] = useFetchFromImageCacheMutation()

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
    return result
  }

  const clearTextEditor = () => {
    publish($TEXT_EDITOR_CLEAR(tab.id))
  }

  const getCurrentGameState = () => {
    const currentGameState = selectGameStateBySpellId(
      store.getState().gameState,
      tab.spell
    )
    return currentGameState?.state ?? {}
  }

  const updateCurrentGameState = update => {
    const newState = {
      spellId: tab.spell,
      state: update,
    }
    dispatch(updateGameState(newState))
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
    ...models.modules,

    // going to need to manuall create theses
    ...models.spells,
  }

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

export default ReteProvider
