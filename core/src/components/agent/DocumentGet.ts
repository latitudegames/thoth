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
} from '../../../types'
import { EngineContext } from '../../engine'
import { triggerSocket, anySocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info = 'Document Get is used to get a document from the search corpus'

type WorkerReturn = {
  output: string
}

export class DocumentGet extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Document Get')

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
    const idInput = new Rete.Input('id', 'ID', anySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const output = new Rete.Output('output', 'Output', anySocket)

    return node
      .addInput(idInput)
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
    const id = inputs['id'][0] as string

    const resp = await axios.get(
      `${process.env.VITE_SEARCH_SERVER_URL}/document`,
      {
        params: {
          documentId: id,
        },
      }
    )

    return {
      output: resp.data,
    }
  }
}
