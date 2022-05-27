import {
  ImageCacheResponse,
  OpenAIResultChoice,
  Spell,
  ThothWorkerInputs,
} from './../../types'
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
      },
    })
    await runnerInstance.loadSpell(imageGeneratorSpell)
    const imageSpellResult = await runnerInstance.defaultRun({ data: 'data' })

    expect(imageSpellResult).toEqual({})
  })
})
