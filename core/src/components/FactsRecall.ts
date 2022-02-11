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
import { getFacts } from '../axiosUtils'
import { EngineContext } from '../engine'
import { triggerSocket, stringSocket, anySocket } from '../sockets'
import { ThothComponent } from '../thoth-component'

const info = 'Facts Recall is used to get facts for an agent and user'

type InputReturn = {
  output: unknown
  facts: unknown
}

export class FactsRecall extends ThothComponent<Promise<InputReturn>> {
  constructor() {
    super('Facts Recall')

    this.task = {
      outputs: {
        output: 'output',
        facts: 'output',
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
    const out = new Rete.Output('output', 'Input String', anySocket)
    const inp = new Rete.Input('string', 'Input String', stringSocket)
    const factsOut = new Rete.Output('facts', 'Output', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addInput(agentInput)
      .addInput(speakerInput)
      .addOutput(dataOutput)
      .addOutput(out)
      .addOutput(factsOut)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const speaker = inputs['speaker'][0] as string
    const agent = inputs['agent'][0] as string
    const action = inputs['string'][0]

    console.log('post facts get', action, speaker, agent)
    const facts = await getFacts(agent, speaker)

    return {
      output: action as string,
      facts: facts,
    }
  }
}
