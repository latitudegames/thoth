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

const info =
  'Conversation Count is used to count of conversation for an agent and user'

type InputReturn = {
  output: number
}

export async function getConversationCount(
  agent: string,
  speaker: string,
  client: string,
  channel: string
) {
  const response = await axios.get(
    `${process.env.REACT_APP_API_ROOT_URL}/conversation_count?agent=${agent}&speaker=${speaker}&client=${client}&channel=${channel}`
  )

  let count = 0

  try {
    count = parseInt(response.data)
  } catch (e) {
    console.log(e)
  }

  return count
}

export class ConversationCount extends ThothComponent<Promise<InputReturn>> {
  constructor() {
    super(' Conversation Count')

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
    const clientInput = new Rete.Input('client', 'Client', stringSocket)
    const channelInput = new Rete.Input('channel', 'Channel', stringSocket)
    const countOut = new Rete.Output('output', 'Count', anySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node
      .addInput(dataInput)
      .addInput(agentInput)
      .addInput(speakerInput)
      .addInput(clientInput)
      .addInput(channelInput)
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
    const client = inputs['client'][0] as string
    const channel = inputs['channel'][0] as string

    const count = await getConversationCount(agent, speaker, client, channel)

    console.log('count returned: ' + count)
    return {
      output: count,
    }
  }
}
