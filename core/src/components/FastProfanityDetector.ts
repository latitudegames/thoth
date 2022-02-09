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
import { fastProfanityDetector } from '../superreality/fastProfanityDetector'
import { ThothComponent } from '../thoth-component'

const info =
  'Fast Profaniuty Detector can detect whether or not a phrase is a prophane'

type InputReturn = {
  output: unknown
  type: string
}

const fewshot = `Nigga,offensive
Niga,offensive
fuck you, sexual
fuck off, hate
fuck, hate
hurt myself, questionable
kill you, violent
destroy you, violent
nigger, offensive
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
