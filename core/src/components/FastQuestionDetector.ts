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
function isQuestion(input: string, data: string) {
  input = input.toLowerCase().trim()

  if (input.endsWith('?')) {
    return true
  }

  let questionStarters = data.split('\n')
  questionStarters = questionStarters.filter(element => {
    return element !== ''
  })

  for (let i = 0; i < questionStarters.length; i++) {
    if (input.startsWith(questionStarters[i])) {
      return true
    }
  }

  return false
}


const info =
  'Fast Question Detector can detect whether or not a phrase is a question'

const fewshot = `why
who
whose
whom
where
what
whats
what's
are you
is he
is she
is it
am i
how`

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
    node.data.fewshot = fewshot

    const inp = new Rete.Input('string', 'String', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const isTrue = new Rete.Output('true', 'True', triggerSocket)
    const isFalse = new Rete.Output('false', 'False', triggerSocket)
    const out = new Rete.Output('output', 'output', anySocket)

    const fewshotControl = new FewshotControl({})

    node.inspector.add(fewshotControl)

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
    const fewshot = node.data.fewshot as string

    const is = isQuestion(action as string, fewshot)

    this._task.closed = is ? ['false'] : ['true']
    return {
      output: action as string,
    }
  }
}
