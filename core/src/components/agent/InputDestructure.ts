import Rete from 'rete'
import { v4 as uuidv4 } from 'uuid'

import { NodeData, ThothNode, ThothWorkerInputs } from '../../../types'
import { Task } from '../../plugins/taskPlugin/task'
import { anySocket } from '../../sockets'
import { ThothComponent, ThothTask } from '../../thoth-component'

const info = `The input component allows you to pass a single value to your chain.  You can set a default value to fall back to if no value is provided at runtime.  You can also turn the input on to receive data from the playtest input.`

type InputReturn = {
  output: unknown
  speaker: string
  agent: string
  client: string
  channelId: string
}

export class InputDestructureComponent extends ThothComponent<InputReturn> {
  nodeTaskMap: Record<number, ThothTask> = {}

  constructor() {
    // Name of the component
    super('Input Destructure')

    this.task = {
      outputs: {
        output: 'output',
        speaker: 'output',
        agent: 'output',
        client: 'output',
        channelId: 'output',
        trigger: 'option',
      },
      init: (task = {} as Task, node: ThothNode) => {
        this.nodeTaskMap[node.id] = task
      },
    }

    this.category = 'Agents'
    this.info = info
    this.display = true
  }

  builder(node: ThothNode) {
    // module components need to have a socket key.
    // todo add this somewhere automated? Maybe wrap the modules builder in the plugin
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    const inp = new Rete.Input('input', 'Input', anySocket)
    const out = new Rete.Output('output', 'output', anySocket)
    const speaker = new Rete.Output('speaker', 'speaker', anySocket)
    const agent = new Rete.Output('agent', 'agent', anySocket)
    const client = new Rete.Output('client', 'client', anySocket)
    const channelId = new Rete.Output('channelId', 'channelId', anySocket)

    return node
      .addInput(inp)
      .addOutput(speaker)
      .addOutput(agent)
      .addOutput(client)
      .addOutput(channelId)
      .addOutput(out)
  }

  worker(_node: NodeData, inputs: ThothWorkerInputs) {
    this._task.closed = ['trigger']
    console.log('inputs is', inputs)

    // If there are outputs, we are running as a module input and we use that value
    return {
      output: (inputs.inp as any).Input,
      speaker: (inputs.inp as any).Speaker ?? 'Speaker',
      agent: (inputs.inp as any).Agent ?? 'Agent',
      client: (inputs.inp as any).Client ?? 'Client',
      channelId: (inputs.inp as any).ChannelID ?? '0',
    }
  }
}
