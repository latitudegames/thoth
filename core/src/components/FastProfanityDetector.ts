/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'

import {
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../types'
import { FewshotControl } from '../dataControls/FewshotControl'
import { EngineContext } from '../engine'
import { triggerSocket, stringSocket, anySocket } from '../sockets'
import { ThothComponent } from '../thoth-component'

/* eslint-disable no-param-reassign */
export function fastProfanityDetector(input: string, words: string) {
  if (nWord(input) || nazi(input)) {
    return { res: true, type: 'offensive' }
  }

  const list: { [key: string]: string } = {}
  let wordsArray = words.split('\n')
  wordsArray = wordsArray.filter(element => {
    return element !== ''
  })

  for (let i = 0; i < wordsArray.length; i++) {
    const data = wordsArray[i].split(',')
    if (data.length !== 2) continue

    const word = data[0].trim().toLowerCase()
    const type = data[1].trim().toLowerCase()
    list[word] = type
  }

  input = input.toLowerCase().trim()
  for (const x in list) {
    if (input.includes(x)) {
      return { res: true, type: list[x] }
    }
  }

  return { res: false, type: '' }
}

//check if a text contains the n* word
function nWord(text: string) {
  const r = new RegExp(`n+[i1l|]+[gkq469]+[e3a4i]+[ra4]s?`)
  return r.test(text)
}

//check if a text contains the nazi word
function nazi(text: string) {
  const r = new RegExp(`n+[a4|]+[z]+[i1l]s?`)
  return r.test(text)
}


const info =
  'Fast Profaniuty Detector can detect whether or not a phrase is a prophane'

type InputReturn = {
  output: unknown
  type: string
}

const fewshot = `
fuck you, sexual
fuck off, hate
fuck, hate
hurt myself, questionable
kill you, violent
stab you, violent
stupid cunt, offensive
suck, hate
cock, sexual
pussy, sexual`

export class FastProfanityDetector extends ThothComponent<
  Promise<InputReturn>
> {
  constructor() {
    super('Fast Profanity Detector')

    this.task = {
      outputs: {
        true: 'option',
        false: 'option',
        output: 'output',
        type: 'output',
      },
    }

    this.category = 'AI/ML'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    node.data.fewshot = fewshot

    const inp = new Rete.Input('string', 'String', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const isTrue = new Rete.Output('true', 'True', triggerSocket)
    const isFalse = new Rete.Output('false', 'False', triggerSocket)
    const out = new Rete.Output('output', 'output', anySocket)
    const typeOut = new Rete.Output('type', 'type', stringSocket)

    const fewshotControl = new FewshotControl({})

    node.inspector.add(fewshotControl)

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addOutput(isTrue)
      .addOutput(isFalse)
      .addOutput(out)
      .addOutput(typeOut)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const action = inputs['string'][0]
    const fewshot = node.data.fewshot as string

    const is = fastProfanityDetector(action as string, fewshot)

    this._task.closed = is.res ? ['false'] : ['true']
    return {
      output: action as string,
      type: is.res ? is.type : '',
    }
  }
}
