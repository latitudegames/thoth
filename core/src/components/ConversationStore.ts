/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
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

const info =
  'Conversation Store is used to store conversation for an agent and user'

type InputReturn = {
  output: unknown
}

export async function setConversation(
  agent: string,
  speaker: string,
  conv: string,
  client: string,
  channel: string
) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_ROOT_URL}/conversation`,
      {
        agent: agent,
        speaker: speaker,
        conversation: conv,
        client: client,
        channel: channel,
      }
    )
    return response.data
  } catch (e) {
    console.log(e)
    return undefined
  }
}

export class ConversationStore extends ThothComponent<Promise<InputReturn>> {
  constructor() {
    super('Conversation Store')

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
    const factsInp = new Rete.Input(
      'convs',
      'Conversation Speaker',
      stringSocket
    )
    const factaInp = new Rete.Input('conva', 'Conversation Agent', stringSocket)
    const clientInput = new Rete.Input('client', 'Client', stringSocket)
    const channelInput = new Rete.Input('channel', 'Channel', stringSocket)
    const inp = new Rete.Input('string', 'Input', stringSocket)
    const out = new Rete.Output('output', 'Output', anySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node
      .addInput(inp)
      .addInput(factsInp)
      .addInput(factaInp)
      .addInput(clientInput)
      .addInput(agentInput)
      .addInput(speakerInput)
      .addInput(channelInput)
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
    const speaker = inputs['speaker'][0] as string
    const agent = inputs['agent'][0] as string
    const action = inputs['string'][0]
    const convSpeaker = inputs['convs'][0] as string
    const convAgent = inputs['conva'][0] as string
    const client = inputs['client'][0] as string
    const channel = inputs['channel'][0] as string

    const resp1 = await setConversation(
      agent,
      speaker,
      convSpeaker,
      client,
      channel
    )
    const resp2 = await setConversation(
      agent,
      speaker,
      convAgent,
      client,
      channel
    )
    console.log(resp1)
    console.log(resp2)

    return {
      output: action as string,
    }
  }
}
