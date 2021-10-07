import { useSnackbar } from 'notistack'
import { useContext, createContext, useState, useRef } from 'react'

import { useDB } from './DatabaseProvider'

export type SpellContext = {
  currentSpell: {}
  getCurrentSpell: () => void
  loadSpell: () => void
  saveSpell: () => void
  saveCurrentSpell: () => void
  stateHistory: never[]
  currentGameState: {}
  getCurrentGameState: () => Record<string, unknown>
  rewriteCurrentGameState: () => Record<string, unknown>
  updateCurrentGameState: () => void
  getThothVersion: () => void
}

const Context = createContext({
  currentSpell: {},
  getCurrentSpell: () => {},
  loadSpell: () => {},
  saveSpell: () => {},
  saveCurrentSpell: () => {},
  stateHistory: [],
  currentGameState: {},
  getCurrentGameState: (): Record<string, unknown> => {
    return {}
  },
  rewriteCurrentGameState: (): Record<string, unknown> => {
    return {}
  },
  updateCurrentGameState: (): Record<string, unknown> => {
    return {}
  },
  getThothVersion: () => {},
})

export const useSpell = () => useContext(Context)

const SpellProvider = ({ children }) => {
  const {
    models: { spells },
  } = useDB()
  const { enqueueSnackbar } = useSnackbar()

  const spellRef =
    useRef<{ name: string; gameState: Record<string, unknown> }>()

  const [currentSpell, setCurrentSpell] = useState({})
  const [stateHistory, setStateHistory] = useState(
    [] as Record<string, unknown>[]
  )

  const updateCurrentSpell = activeTab => {
    spellRef.current = activeTab
    setCurrentSpell(activeTab)
  }

  const getCurrentSpell = () => {
    return spellRef.current
  }

  const loadSpell = async spellId => {
    const spellDoc = await spells.getSpell(spellId)

    if (!spellDoc) return

    const spell = spellDoc.toJSON()
    updateCurrentSpell(spell)
  }

  const getThothVersion = () => {
    //wherever we would like to store this...
    return 'Latitude Thoth 0.0.1'
  }

  const saveSpell = async (spellId, update, snack = true) => {
    try {
      await spells.updateSpell(spellId, update)
      if (snack) enqueueSnackbar('Spell saved')
    } catch (err) {
      if (snack) enqueueSnackbar('Error saving spell')
    }
  }

  const saveCurrentSpell = async update => {
    const spell = await saveSpell(spellRef?.current?.name, update)
    return spell
  }

  const getCurrentGameState = async () => {
    const spellDoc = await spells.getSpell(spellRef?.current?.name)
    const spell = spellDoc.toJSON()
    return spell.gameState
  }

  const updateCurrentGameState = async update => {
    const newState = {
      ...spellRef?.current?.gameState,
      ...update,
    }

    const state = await rewriteCurrentGameState(newState)
    return state
  }

  const rewriteCurrentGameState = async state => {
    const spell = await spells.getSpell(spellRef?.current?.name)
    const gamestate = spell?.gameState as Record<string, unknown>
    setStateHistory([...stateHistory, gamestate])

    const update = { gameState: state }
    const updatedSpell = await spells.updateSpell(spell.name, update)

    const updated = updatedSpell.toJSON()
    updateCurrentSpell(updated)
  }

  // Check for existing currentSpell in the db
  const publicInterface = {
    currentSpell,
    getCurrentSpell,
    getCurrentGameState,
    getThothVersion,
    loadSpell,
    rewriteCurrentGameState,
    saveCurrentSpell,
    saveSpell,
    setCurrentSpell,
    stateHistory,
    updateCurrentGameState,
    ...spells,
  }

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

export default SpellProvider
