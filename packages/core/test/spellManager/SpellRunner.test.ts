import {
  ImageCacheResponse,
  OpenAIResultChoice,
  ThothWorkerInputs,
} from './../../types'
import SpellRunner from '../../src/spellManager/SpellRunner'

describe('SpellRunner', () => {
  const runnerInstance = new SpellRunner({
    thothInterface: {
      completion: () => {
        return new Promise(resolve => resolve('string')) as Promise<
          string | OpenAIResultChoice
        >
      },
      enkiCompletion: () => {
        return new Promise(resolve => resolve({ outputs: ['string'] }))
      },
      huggingface: () => {
        return new Promise(resolve => resolve({ outputs: ['string'] }))
      },
      getCurrentGameState: () => {
        return {}
      },
      setCurrentGameState: (state: Record<string, unknown>) => {},
      updateCurrentGameState: (state: Record<string, unknown>) => {},
      runSpell: (flattenedInputs: Record<string, unknown>, spellId: string) => {
        return new Promise(resolve => resolve({ outputs: ['string'] }))
      },
      readFromImageCache: (caption: string) => {
        return new Promise(resolve => resolve({} as ImageCacheResponse))
      },
      processCode: (
        code: unknown,
        inputs: ThothWorkerInputs,
        data: Record<string, unknown>,
        state: Record<string, unknown>
      ) => {
        return {}
      },
    },
  })
})
