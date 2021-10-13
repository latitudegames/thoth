import { EngineContext } from '@latitudegames/thoth-core'
import { useContext, createContext } from 'react'
import { useDispatch } from 'react-redux'

import { postEnkiCompletion } from '../services/game-api/enki'
import { completion as _completion } from '../services/game-api/text'
import { selectGameStateBySpellId, updateGameState } from '../state/gameState'
import { store } from '../state/store'
import { invokeInference } from '../utils/huggingfaceHelper'
import { useDB } from './DatabaseProvider'
import { usePubSub } from './PubSubProvider'

/*
Some notes here.  The new rete provider, not to be confused with the old rete provider renamed to the editor provider, is designed to serve as the single source of truth for interfacing with the rete internal system.  This unified interface will also allow us to replicate the same API in the server, where rete expects certain functions to exist but doesn't care what is behind these functions so long as they work.
Not all functions will be needed on the server, and functions which are not will be labeled as such.
*/

export interface ReteContext extends EngineContext {
  onInspector: () => void
  onPlayTest: () => void
  onGameState: () => void
  sendToPlaytest: () => void
  sendToInspector: () => void
  clearTextEditor: () => void
  getSpell: () => void
  getModule: () => void
  getGameState: () => void
  setGameState: () => void
  getModules: () => void
}

const Context = createContext({
  onInspector: () => {},
  onPlayTest: () => {},
  onGameState: () => {},
  onAddModule: () => {},
  onUpdateModule: () => {},
  onDeleteModule: () => {},
  onModuleUpdated: () => {},
  sendToPlaytest: () => {},
  sendToInspector: () => {},
  clearTextEditor: () => {},
  getSpell: () => {},
  getModule: () => {},
  getGameState: () => {},
  setGameState: () => {},
  getModules: async () => {},
  getCurrentGameState: () => ({} as Record<string, unknown>),
  updateCurrentGameState: () => {},
  completion: _completion,
  enkiCompletion: async (): Promise<{ outputs: string[] }> =>
    await new Promise(resolve => {
      resolve({} as { outputs: string[] })
    }),
  huggingface: async (): Promise<{ [key: string]: unknown; error: unknown }> =>
    await new Promise(resolve => {
      resolve({} as { [key: string]: unknown; error: unknown })
    }),
})

export const useRete = () => useContext(Context)

const ReteProvider = ({ children, tab }) => {
  const { events, publish, subscribe } = usePubSub()
  const dispatch = useDispatch()
  const {
    models: { spells, modules },
  } = useDB()

  const {
    $PLAYTEST_INPUT,
    $PLAYTEST_PRINT,
    $INSPECTOR_SET,
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

  const clearTextEditor = () => {
    publish($TEXT_EDITOR_CLEAR(tab.id))
  }

  const getCurrentGameState = () => {
    const currentGameState = selectGameStateBySpellId(
      store.getState().gameState,
      tab.spell
    )
    return currentGameState?.state
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
    sendToPlaytest,
    onPlaytest,
    clearTextEditor,
    completion,
    enkiCompletion,
    huggingface,
    getCurrentGameState,
    updateCurrentGameState,
    ...modules,

    // going to need to manuall create theses
    ...spells,
  }

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

export default ReteProvider
