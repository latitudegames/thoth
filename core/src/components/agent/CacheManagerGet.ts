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
import { triggerSocket, stringSocket, anySocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info = 'Cache Manager Get is used to get data from the cache manager'

type WorkerReturn = {
  output: string
}

export class CacheManagerGet extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Cache Manager Get')

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
    const keyInput = new Rete.Input('key', 'Key', stringSocket)
    const agentInput = new Rete.Input('agent', 'Agent', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const output = new Rete.Output('output', 'Output', anySocket)

    return node
      .addInput(keyInput)
      .addInput(agentInput)
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
    const key = inputs['key'][0] as string
    const agent = inputs['agent'] ? (inputs['agent'][0] as string) : 'Global'

    const resp = await axios.get(
      `${process.env.REACT_APP_API_URL}/cache_manager`,
      {
        params: {
          key: key,
          agent: agent,
        },
      }
    )

    console.log('cache get, resp:', resp.data.data)
    return {
      output: resp.data.data,
    }
  }
}
