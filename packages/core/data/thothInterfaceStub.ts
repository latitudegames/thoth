import {
  ImageCacheResponse,
  OpenAIResultChoice,
  ThothWorkerInputs,
} from '../types'

export default {
  completion: () => {
    return new Promise(resolve => resolve('string')) as Promise<
      string | OpenAIResultChoice
    >
  },
  enkiCompletion: (): Promise<{ outputs: string[] }> => {
    return new Promise(resolve => resolve({ outputs: ['string'] }))
  },
  huggingface: (): Promise<{ outputs: string[] }> => {
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
  readFromImageCache: (caption: string): Promise<ImageCacheResponse> => {
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
}
