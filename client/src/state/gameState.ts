import { createSelector } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import {
  createSlice,
  // createSelector,
  createEntityAdapter,
} from '@reduxjs/toolkit'

export interface GameState {
  id: string
  state: Record<string, unknown>
  history: Record<string, unknown>[]
  spellId: string
}

const gameStateAdapater = createEntityAdapter<GameState>()
const gameStateSelectors = gameStateAdapater.getSelectors()
const initialState = gameStateAdapater.getInitialState()

const gameStateSlice = createSlice({
  name: 'gameStates',
  initialState,
  reducers: {
    updateGameState: (state, action) => {
      const gameState = gameStateSelectors.selectById(state, action.payload.id)
      const newGameState = {
        ...action.payload,
        history: [...action.payload.history, gameState],
      }

      gameStateAdapater.updateOne(state, newGameState)
    },
    createGameState: (state, action) => {
      const newGameState = {
        ...action.payload,
        id: uuidv4(),
        history: [],
      }

      gameStateAdapater.addOne(state, newGameState)
    },
  },
})

export const selectGameStateBySpellId = createSelector(
  [gameStateSelectors.selectEntities, (_, spellId) => spellId],
  (gameStates: GameState[], spellId) => {
    return gameStates.find(state => state.spellId === spellId)
  }
)

export const { selectById } = gameStateSelectors
export const { updateGameState, createGameState } = gameStateSlice.actions
export default gameStateSlice.reducer
