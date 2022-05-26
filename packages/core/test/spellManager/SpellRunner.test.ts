import {
  ImageCacheResponse,
  OpenAIResultChoice,
  Spell,
  ThothWorkerInputs,
} from './../../types'
import SpellRunner from '../../src/spellManager/SpellRunner'
import imageGeneratorSpell from '../../data/imageGeneratorSpell'
require('regenerator-runtime/runtime')

describe('SpellRunner', () => {
  it('Returns an Image Cache Response', async () => {
    console.log(process.env.NODE_ENV)
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
        runSpell: (
          flattenedInputs: Record<string, unknown>,
          spellId: string
        ) => {
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
    await runnerInstance.loadSpell(imageGeneratorSpell as unknown as Spell)
    const imageSpellResult = await runnerInstance.defaultRun({ data: 'data' })

    expect(imageSpellResult).toEqual({})
  })
})
