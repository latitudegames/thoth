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

const info = 'Opinion About Speaker Get'

type InputReturn = {
  output: unknown
  matrix: unknown
}

export async function getMatrix(agent: string, speaker: string) {
  const response = await axios.get(
    `${process.env.REACT_APP_API_ROOT_URL}/relationship_matrix?agent=${agent}&speaker=${speaker}`
  )
  return response.data
}

export class OpinionAboutSpeakerGet extends ThothComponent<
  Promise<InputReturn>
> {
  constructor() {
    super('Opinion About Speaker Get')

    this.task = {
      outputs: {
        output: 'output',
        matrix: 'output',
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
    const out = new Rete.Output('output', 'Input String', anySocket)
    const inp = new Rete.Input('string', 'Input String', stringSocket)
    const matrixOut = new Rete.Output('matrix', 'Output', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addInput(agentInput)
      .addInput(speakerInput)
      .addOutput(dataOutput)
      .addOutput(out)
      .addOutput(matrixOut)
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

    const matrix = await getMatrix(agent, speaker)

    return {
      output: action as string,
      matrix:
        matrix.length > 0 && matrix !== 'internal error'
          ? matrix
          : JSON.stringify({
            Enemy: 0,
            Friend: 0,
            Student: 0,
            Teacher: 0,
            Repulsed: 0,
            Attracted: 0,
            Honest: 0,
            Manipulative: 0,

            EnemyLimit: 1,
            FriendLimit: 1,
            StudentLimit: 1,
            TeacherLimit: 1,
            RepulsedLimit: 1,
            AttractedLimit: 1,
          }),
    }
  }
}
