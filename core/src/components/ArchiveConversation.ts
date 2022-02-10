/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'

import {
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../types'
import { InputControl } from '../dataControls/InputControl'
import { EngineContext } from '../engine'
import { triggerSocket, stringSocket, anySocket } from '../sockets'
import { ThothComponent } from '../thoth-component'

const info = 'Archive Conversation is used to archive old conversation'

type WorkerReturn = {
  output: string
}

export class ArchiveConversation extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Archive Conversation')

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
    const speakerInput = new Rete.Input('speaker', 'Speaker', stringSocket)
    const inp = new Rete.Input('string', 'Fact', stringSocket)
    const out = new Rete.Output('output', 'Output', anySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    const messageCount = new InputControl({
      dataKey: 'messageCount',
      name: 'Message Count',
      icon: 'moon',
    })

    node.inspector.add(messageCount)

    return node
      .addInput(inp)
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
    const action = inputs['string'][0] as string
    const messageCountData = node?.data?.messageCount as string
    const messageCount = messageCountData ? parseFloat(messageCountData) : 10

    console.log(messageCount)
    //send post request

    return {
      output: action,
    }
  }
}
