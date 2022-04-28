/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import Rete from 'rete'

import {
  EngineContext,
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs
} from '../../../types'
import { anySocket, stringSocket, triggerSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info = 'Cache Manager Set is used to (set/add) data in the cache manager'

export class CacheManagerSet extends ThothComponent<void> {
  constructor() {
    super('Cache Manager Set')

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
    const keyInput = new Rete.Input('key', 'Key', stringSocket)
    const agentInput = new Rete.Input('agent', 'Agent', stringSocket)
    const valueInput = new Rete.Input('value', 'Value', anySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node
      .addInput(keyInput)
      .addInput(agentInput)
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
    const key = inputs['key'][0] as string
    const agent = inputs['agent'][0] as string
    const value = inputs['value'][0]

    await axios.post(`${process.env.REACT_APP_API_URL}/cache_manager`, {
      key: key,
      agent: agent,
      value: value,
    })
  }
}
