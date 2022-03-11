/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
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

const info = "Get Agents Facts returns the select agent's facts"

type InputReturn = {
  output: unknown
  facts: unknown
}
export class GetAgentsFacts extends ThothComponent<Promise<InputReturn>> {
  constructor() {
    super('Get Agents Facts')

    this.task = {
      outputs: {
        output: 'output',
        facts: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Database'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const agentInput = new Rete.Input('agent', 'Agent', stringSocket)
    const out = new Rete.Output('output', 'Input String', anySocket)
    const inp = new Rete.Input('string', 'Input String', stringSocket)
    const factsOut = new Rete.Output('facts', 'Output', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addInput(agentInput)
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
    const agent = inputs['agent'][0] as string
    const action = inputs['string'][0]

    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/agent_facts`,
      {
        params: {
          agent: agent,
        },
      }
    )

    return {
      output: action as string,
      facts: response.data.facts,
    }
  }
}
