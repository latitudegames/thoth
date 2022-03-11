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

const info = 'Opinion About Speaker Set'

type InputReturn = {
  output: unknown
}

async function storeMatrix(agent: string, speaker: string, matrix: string) {
  const response = await axios.post(
    `${process.env.REACT_APP_API_ROOT_URL}/relationship_matrix`,
    {
      agent: agent,
      speaker: speaker,
      matrix: matrix,
    }
  )

  console.log(response.data)
}

export class OpinionAboutSpeakerSet extends ThothComponent<
  Promise<InputReturn>
> {
  constructor() {
    super('Opinion About Speaker Set')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Database'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const agentInput = new Rete.Input('agent', 'Agent', stringSocket)
    const speakerInput = new Rete.Input('speaker', 'Speaker', stringSocket)
    const matrixInp = new Rete.Input(
      'matrix',
      'Relationship Matrix',
      stringSocket
    )
    const inp = new Rete.Input('string', 'Input', stringSocket)
    const out = new Rete.Output('output', 'Output', anySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node
      .addInput(inp)
      .addInput(matrixInp)
      .addInput(agentInput)
      .addInput(speakerInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(out)
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
    const matrix = inputs['matrix'][0] as string

    const resp = await storeMatrix(agent, speaker, matrix)
    console.log(resp)

    return {
      output: action as string,
    }
  }
}
