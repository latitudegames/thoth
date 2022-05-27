import { ImageCacheResponse } from './../../types'
import SpellRunner from '../../src/spellManager/SpellRunner'
import imageGeneratorSpell from '../../data/imageGeneratorSpell'
import thothInterfaceStub from '../../data/thothInterfaceStub'
require('regenerator-runtime/runtime')

describe('SpellRunner', () => {
  it('Returns an Image Cache Response', async () => {
    console.log(process.env.NODE_ENV)
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
})
