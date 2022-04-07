import { EngineContext } from '@latitudegames/thoth-core/dist/types'

export const buildThothInterface = (): EngineContext => {
  return {
    async completion(body) {
      return 'testing'
    },
    getCurrentGameState() {
      return {}
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
