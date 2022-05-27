import { ImageCacheResponse, OpenAIResultChoice } from './../../types'
import SpellRunner from '../../src/spellManager/SpellRunner'
import imageGeneratorSpell from '../../data/imageGeneratorSpell'
import thothInterfaceStub from '../../data/thothInterfaceStub'
import generatorSpell from '../../data/generatorSpell'
import codeSpell from '../../data/codeSpell'
import generatorSwitchSpell from '../../data/generatorSwitchSpell'
require('regenerator-runtime/runtime')

describe('SpellRunner', () => {
  it('Returns an Image Cache Response from an Image Generator Spell', async () => {
    const imageCacheMock = jest
      .fn()
      .mockImplementation((caption: string): Promise<ImageCacheResponse> => {
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
      })
    const runnerInstance = new SpellRunner({
      thothInterface: {
        ...thothInterfaceStub,
        readFromImageCache: imageCacheMock,
      },
    })
    await runnerInstance.loadSpell(imageGeneratorSpell)
    const imageSpellResult = await runnerInstance.defaultRun({
      input: 'imageprompt',
    })
    expect(imageCacheMock).toBeCalledWith('imageprompt', undefined, undefined)
    expect(imageSpellResult).toEqual({
      output:
        'https://aidungeon-images.s3.us-east-2.amazonaws.com/generated_images/48b384e5-823b-44de-a77a-5aad3ee03908.png',
    })
  })
  it('Returns a Text Completion from an Generator Spell', async () => {
    const completionMock = jest.fn().mockImplementation(() => {
      return new Promise(resolve => resolve('completionresult')) as Promise<
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
    expect(completionMock).toBeCalledWith({
      frequencyPenalty: 0,
      maxTokens: 50,
      model: 'vanilla-jumbo',
      prompt: 'textprompt',
      stop: ['\\n'],
      temperature: 0.8,
    })
    expect(generatorSpellResult).toEqual({
      output: 'textprompt completionresult',
    })
  })
  it('Returns a Text Completion from an Generator Spell that uses a Switch Component', async () => {
    const completionMock = jest.fn().mockImplementation(() => {
      return new Promise(resolve => resolve('completionresult')) as Promise<
        string | OpenAIResultChoice
      >
    })
    const runnerInstance = new SpellRunner({
      thothInterface: {
        ...thothInterfaceStub,
        completion: completionMock,
      },
    })
    await runnerInstance.loadSpell(generatorSwitchSpell)
    const generatorSpellResult = await runnerInstance.defaultRun({
      input: 'yes',
    })
    expect(completionMock).toBeCalledWith({
      frequencyPenalty: 0,
      maxTokens: 50,
      model: 'vanilla-jumbo',
      prompt: 'Generate',
      stop: ['\\n'],
      temperature: 0.7,
    })
    expect(generatorSpellResult).toEqual({
      output: 'completionresult',
    })
  })
  it('Returns result from an Code Spell', async () => {
    const codeMock = jest
      .fn()
      .mockImplementation(thothInterfaceStub.processCode)
    const runnerInstance = new SpellRunner({
      thothInterface: { ...thothInterfaceStub, processCode: codeMock },
    })
    await runnerInstance.loadSpell(codeSpell)
    const codeSpellResult = await runnerInstance.defaultRun({
      input: 'textprompt',
    })
    expect(codeMock).toBeCalledWith(
      "\n// inputs: dictionary of inputs based on socket names\n// data: internal data of the node to read or write to nodes data state\n// state: access to the current game state in the state manager window. Return state to update the state.\nfunction worker(inputs, data, state) {\n\n  // Keys of the object returned must match the names \n  // of your outputs you defined.\n  // To update the state, you must return the modified state.\n  return {modifiedInput: inputs.input + ' modified'}\n}\n",
      { input: ['textprompt'] },
      {},
      {}
    )
    expect(codeSpellResult).toEqual({
      output: 'textprompt modified',
    })
  })
})
