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

async function getConversation(
  agent: string,
  speaker: string,
  client: string,
  channel: string
) {
  const url = encodeURI(
    `${process.env.REACT_APP_API_ROOT_URL ?? process.env.API_ROOT_URL ?? 'http://localhost:8001'
    }/conversation?agent=${agent}&speaker=${speaker}&client=${client}&channel=${channel}`
  ).replace(' ', '%20')

  console.log("url is", url)
  const response = await axios.get(url)
  console.log("response is, ", response)
  return response.data
}

const info =
  'Conversation Recall is used to get conversation for an agent and user'

type InputReturn = {
  conv: unknown
}

export class ConversationRecall extends ThothComponent<Promise<InputReturn>> {
  constructor() {
    super('Conversation Recall')

    this.task = {
      outputs: {
        conv: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Agents'
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
    console.log('inputs are', inputs)
    const conv = await getConversation(agent, speaker, client, channel)
    console.log('conv is', conv)

    return {
      conv: conv ?? '',
    }
  }
}
