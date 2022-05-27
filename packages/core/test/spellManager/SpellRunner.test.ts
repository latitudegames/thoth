import { ImageCacheResponse, OpenAIResultChoice } from './../../types'
import SpellRunner from '../../src/spellManager/SpellRunner'
import imageGeneratorSpell from '../../data/imageGeneratorSpell'
import thothInterfaceStub from '../../data/thothInterfaceStub'
import generatorSpell from '../../data/generatorSpell'
require('regenerator-runtime/runtime')

describe('SpellRunner', () => {
  it('Returns an Image Cache Response from an Image Generator Spell', async () => {
    const runnerInstance = new SpellRunner({
      thothInterface: {
        ...thothInterfaceStub,
        readFromImageCache: (caption: string): Promise<ImageCacheResponse> => {
          return new Promise(resolve =>
            resolve({
              images: [
                {
                  imageUrl:
                    'https://aidungeon-images.s3.us-east-2.amazonaws.com/generated_images/48b384e5-823b-44de-a77a-5aad3ee03908.png',
                },
              ],
            } as ImageCacheResponse)
          )
        },
      },
    })
    await runnerInstance.loadSpell(imageGeneratorSpell)
    const imageSpellResult = await runnerInstance.defaultRun({ input: 'data' })

    expect(imageSpellResult).toEqual({
      output:
        'https://aidungeon-images.s3.us-east-2.amazonaws.com/generated_images/48b384e5-823b-44de-a77a-5aad3ee03908.png',
    })
  })
  it('Returns a Text Completion from an Generator Spell', async () => {
    const completionMock = jest.fn().mockImplementation(() => {
      return new Promise(resolve => resolve('string')) as Promise<
        string | OpenAIResultChoice
      >
    })
    const runnerInstance = new SpellRunner({
      thothInterface: {
        ...thothInterfaceStub,
        completion: completionMock,
      },
    })
    await runnerInstance.loadSpell(generatorSpell)
    const generatorSpellResult = await runnerInstance.defaultRun({
      input: 'textprompt',
    })

    expect(generatorSpellResult).toEqual({
      output: 'textprompt string',
    })
  })
})
