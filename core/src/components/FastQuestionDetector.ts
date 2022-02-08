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
import { EngineContext } from '../engine'
import { triggerSocket, stringSocket, anySocket } from '../sockets'
import { isQuestion } from '../superreality/fastQuestionDetector'
import { ThothComponent } from '../thoth-component'

const info =
  'Fast Question Detector can detect whether or not a phrase is a question'

type InputReturn = {
  output: unknown
}

export class FastQuestionDetector extends ThothComponent<Promise<InputReturn>> {
  constructor() {
    super('Fast Question Detector')

    this.task = {
      outputs: { true: 'option', false: 'option', output: 'output' },
    }

    this.category = 'AI/ML'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const inp = new Rete.Input('string', 'String', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const isTrue = new Rete.Output('true', 'True', triggerSocket)
    const isFalse = new Rete.Output('false', 'False', triggerSocket)
    const out = new Rete.Output('output', 'output', anySocket)

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addOutput(isTrue)
      .addOutput(isFalse)
      .addOutput(out)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const action = inputs['string'][0]

    const is = isQuestion(action as string)

    this._task.closed = is ? ['false'] : ['true']
    return {
      output: action as string,
    }
  }
}
