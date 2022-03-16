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

type InputReturn = {}

export async function setConversation(
  agent: string,
  speaker: string,
  conv: string,
  client: string,
  channel: string
) {
  const response = await axios.post(
    `${process.env.REACT_APP_API_URL ?? 'http://localhost:8001'}/conversation`,
    {
      agent: agent,
      speaker: speaker,
      conversation: conv,
      client: client,
      channel: channel,
    }
  )
  console.log('response is', response)
  return response.data
}

export class ConversationStore extends ThothComponent<Promise<InputReturn>> {
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

    console.log('convSpeaker is', convSpeaker)
    console.log('convAgent is', convAgent)

    // 1. Get conversation input (to speed things up)
    // 2. If no conversation input, get from db
    // 4. Add a conversation length limit
    // 5. Delete archive node if there is one
    // 6. Append new conversation and log to test
    // 7. Pack JSON to string and save to db 


    // B Slice and move any conversation to the archive if it's too long
    // Make sure on the other side that we're appending to existing conversation
    await axios.post(`${process.env.REACT_APP_API_URL}/archiveConversation`, {
      agent: agent,
      speaker: speaker,
      client: client,
      channel: channel,
    })

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
    console.log('Setting conversation store...')
    console.log(resp1)
    console.log(resp2)

    return {}
  }
}
