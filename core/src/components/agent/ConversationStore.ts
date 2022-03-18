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
} from '../../../types'
import { EngineContext } from '../../engine'
import { triggerSocket, stringSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info =
  'Conversation Store is used to store conversation for an agent and user'

export async function setConversation(
  agent: string,
  speaker: string,
  conv: string,
  client: string,
  channel: string
) {
  const response = await axios.post(
    `${
      process.env.REACT_APP_API_ROOT_URL ?? 'http://localhost:8001'
    }/conversation`,
    {
      agent,
      speaker,
      conv,
      client,
      channel,
    }
  )
  return response.data
}

export class ConversationStore extends ThothComponent<Promise<void>> {
  constructor() {
    super('Conversation Store')

    this.task = {
      outputs: {
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
    const factsInp = new Rete.Input(
      'convs',
      'Conversation Speaker',
      stringSocket
    )
    const factaInp = new Rete.Input('conva', 'Conversation Agent', stringSocket)
    const clientInput = new Rete.Input('client', 'Client', stringSocket)
    const channelInput = new Rete.Input('channel', 'Channel', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node
      .addInput(factsInp)
      .addInput(factaInp)
      .addInput(clientInput)
      .addInput(agentInput)
      .addInput(speakerInput)
      .addInput(channelInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    console.log('Input is', inputs)
    const speaker = inputs['speaker'][0] as string
    const agent = inputs['agent'][0] as string
    const convSpeaker = inputs['convs'][0] as string
    const convAgent = inputs['conva'][0] as string
    const client = inputs['client'][0] as string
    const channel = inputs['channel'][0] as string

    const respUser = await setConversation(
      agent,
      speaker,
      convSpeaker,
      client,
      channel
    )

    if (!silent) node.display(respUser.data)
    const respAgent = await setConversation(
      agent,
      agent,
      convAgent,
      client,
      channel
    )
    if (!silent) node.display(respAgent.data)
  }
}
