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
import { triggerSocket, stringSocket, anySocket } from '../sockets'
import { ThothComponent } from '../thoth-component'

const info = 'Document Set is used to add a document in the search corpus'

export class DocumentSet extends ThothComponent<void> {
  constructor() {
    super('Document Set')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'I/O'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const agentInput = new Rete.Input('agent', 'Agent', stringSocket)
    const documentInput = new Rete.Input('document', 'Document', stringSocket)
    const metadataInput = new Rete.Input('metadata', 'Metadata', stringSocket)
    const valueInput = new Rete.Input('value', 'Value', anySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node
      .addInput(agentInput)
      .addInput(documentInput)
      .addInput(metadataInput)
      .addInput(valueInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const agent = inputs['agent'][0] as string
    const document = inputs['document'][0] as string
    const metadata = inputs['metadata'][0] as string

    await axios.post(`${process.env.VITE_SEARCH_SERVER_URL}/document`, {
      agent: agent,
      document: document,
      metadata: metadata,
    })
  }
}
