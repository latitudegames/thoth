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

async function getConversation(
  agent: string,
  speaker: string,
  client: string,
  channel: string
) {
  const response = await axios.get(
    `${process.env.REACT_APP_API_ROOT_URL}/conversation?agent=${agent}&speaker=${speaker}&client=${client}&channel=${channel}`
  )
  return response.data
}

const info =
  'Conversation Recall is used to get conversation for an agent and user'

type InputReturn = {
  output: unknown
  conv: unknown
}

export class ConversationRecall extends ThothComponent<Promise<InputReturn>> {
  constructor() {
    super('Conversation Recall')

    this.task = {
      outputs: {
        output: 'output',
        conv: 'output',
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
    const out = new Rete.Output('output', 'Input String', anySocket)
    const inp = new Rete.Input('string', 'Input String', stringSocket)
    const factsOut = new Rete.Output('facts', 'Output', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addInput(agentInput)
      .addInput(speakerInput)
      .addInput(clientInput)
      .addInput(channelInput)
      .addOutput(dataOutput)
      .addOutput(out)
      .addOutput(factsOut)
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
    const client = inputs['client'][0] as string
    const channel = inputs['channel'][0] as string

    const conv = await getConversation(agent, speaker, client, channel)

    return {
      output: action as string,
      conv: conv,
    }
  }
}
