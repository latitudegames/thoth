/* eslint-disable no-async-promise-executor */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-inferrable-types */
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
import { triggerSocket, stringSocket } from '../sockets'
import { ThothComponent } from '../thoth-component'

const info = 'Agent Text Completion is using OpenAI for the agent to respond.'

type WorkerReturn = {
  output: string
}

export class AddAgent extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Add Agent')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'AI/ML'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const inp = new Rete.Input('string', 'Text', stringSocket)
    const agent = new Rete.Input('agent', 'Agent', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'output', stringSocket)

    return node
      .addInput(inp)
      .addInput(agent)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(outp)
  }

  /*for text completion:
  const data = {
    "prompt": context,
    "temperature": 0.9,
    "max_tokens": 100,
    "top_p": 1,
    "frequency_penalty": dialogFrequencyPenality,
    "presence_penalty": dialogPresencePenality,
    "stop": ["\"\"\"", `${speaker}:`, '\n']
  };
  */

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const action = inputs['string'][0] as string
    const agent = inputs['agent'][0] as string

    return {
      output: action + '\n' + agent + ': ',
    }
  }
}
