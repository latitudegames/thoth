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
} from '../../../types'
import { EngineContext } from '../../engine'
import { triggerSocket, stringSocket, anySocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info = 'Facts Count is used to count of facts for an agent and user'

type InputReturn = {
  output: number
}

export async function getFactsCount(agent: string, speaker: string) {
  const response = await axios.get(
    `${process.env.REACT_APP_API_ROOT_URL}/facts_count?agent=${agent}&speaker=${speaker}`
  )

  let count = 0

  try {
    count = parseInt(response.data)
  } catch (e) {
    console.log(e)
  }

  return count
}

export class FactsCount extends ThothComponent<Promise<InputReturn>> {
  constructor() {
    super('Facts Count')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Agents'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const agentInput = new Rete.Input('agent', 'Agent', stringSocket)
    const speakerInput = new Rete.Input('speaker', 'Speaker', stringSocket)
    const countOut = new Rete.Output('output', 'Count', anySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node
      .addInput(dataInput)
      .addInput(agentInput)
      .addInput(speakerInput)
      .addOutput(dataOutput)
      .addOutput(countOut)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const speaker = inputs['speaker'][0] as string
    const agent = inputs['agent'][0] as string

    const count = await getFactsCount(agent, speaker)

    console.log('count returned: ' + count)
    return {
      output: count,
    }
  }
}
