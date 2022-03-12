/* eslint-disable @typescript-eslint/no-inferrable-types */
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
import { triggerSocket, anySocket, stringSocket } from '../sockets'
import { ThothComponent } from '../thoth-component'

const info =
  'Search is used to do neural search in the search corpus and return a document'

type WorkerReturn = {
  output: string
}

export class Search extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Search')

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
    const agentInput = new Rete.Input('agent', 'Agent', stringSocket)
    const questionInput = new Rete.Input('question', 'Question', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const output = new Rete.Output('output', 'Output', anySocket)

    return node
      .addInput(agentInput)
      .addInput(questionInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(output)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const agent = inputs['agent'][0] as string
    const question = inputs['question'][0] as string

    const resp = await axios.get(
      `${process.env.VITE_SEARCH_SERVER_URL}/search`,
      {
        params: {
          agent: agent,
          question: question,
          sameTopicOnly: false,
        },
      }
    )

    return {
      output: resp.data,
    }
  }
}
