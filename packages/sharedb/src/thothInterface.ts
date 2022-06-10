import { EngineContext } from '@latitudegames/thoth-core/dist/types'

export const buildThothInterface = (): EngineContext => {
  return {
    async completion(body) {
      return 'testing'
    },
    setCurrentGameState() {},
    getCurrentGameState() {
      return {}
    },
    async enkiCompletion() {
      return { outputs: [] }
    },
    updateCurrentGameState() {},
    async huggingface() {
      return {}
    },
    async runSpell() {
      return {}
    },
    async readFromImageCache() {
      return { images: [] }
    },
    processCode() {},
  }
}
