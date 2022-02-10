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
import { ThothComponent } from '../thoth-component'

const info = 'Facts Count is used to count of facts for an agent and user'

type InputReturn = {
  output: unknown
  count: number
}

export class FactsCount extends ThothComponent<Promise<InputReturn>> {
  constructor() {
    super('Facts Count')

    this.task = {
      outputs: {
        output: 'output',
        count: 'output',
        trigger: 'option',
      },
    }

    this.category = 'AI/ML'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const agentInput = new Rete.Input('agent', 'Agent', stringSocket)
    const speakerInput = new Rete.Input('speaker', 'Speaker', stringSocket)
    const out = new Rete.Output('output', 'Output', anySocket)
    const inp = new Rete.Input('string', 'Input String', stringSocket)
    const countOut = new Rete.Output('count', 'Output', anySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addInput(agentInput)
      .addInput(speakerInput)
      .addOutput(dataOutput)
      .addOutput(out)
      .addOutput(countOut)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const speaker = inputs['speaker'][0]
    const agent = inputs['agent'][0]
    const action = inputs['string'][0]

    console.log('post facts get count', action, speaker, agent)
    const count = 0

    return {
      output: action,
      count: count,
    }
  }
}
