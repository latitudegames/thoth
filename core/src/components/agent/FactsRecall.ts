/* eslint-disable camelcase */
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
import { InputControl } from '../../dataControls/InputControl'
import { EngineContext } from '../../engine'
import { triggerSocket, stringSocket, anySocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

async function getFacts(
  agent: string,
  speaker: string,
  client: string,
  channel: string,
  maxCount = 1
) {
  const response = await axios.get(
    `${process.env.REACT_APP_API_ROOT_URL ??
    process.env.API_ROOT_URL ??
    'http://localhost:8001'
    }/facts`,
    {
      params: {
        agent: agent,
        speaker: speaker,
        client: client,
        channel: channel,
        maxCount: maxCount,
      },
    }
  )
  console.log('response.data:', response.data)
  return response.data
}

const info =
  'Facts Recall is used to get facts for an agent and user'

type InputReturn = {
  output: unknown
}

export class FactsRecall extends ThothComponent<Promise<InputReturn>> {
  constructor() {
    super('Facts Recall')

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
    const agentInput = new Rete.Input('agent', 'Agent', stringSocket)
    const speakerInput = new Rete.Input('speaker', 'Speaker', stringSocket)
    const clientInput = new Rete.Input('client', 'Client', stringSocket)
    const channelInput = new Rete.Input('channel', 'Channel', stringSocket)
    const out = new Rete.Output('output', 'Conversation', anySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    const max_count = new InputControl({
      dataKey: 'max_count',
      name: 'Max Count',
      icon: 'moon',
    })

    node.inspector.add(max_count)

    return node
      .addInput(agentInput)
      .addInput(speakerInput)
      .addInput(clientInput)
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
    const client = inputs['client'][0] as string
    const channel = inputs['channel'][0] as string

    const maxCountData = node.data?.max_count as string
    const maxCount = maxCountData ? parseInt(maxCountData) : 10

    const conv = await getFacts(agent, speaker, client, channel, maxCount)
    if (!silent) node.display(conv || 'Not found')

    return {
      output: conv ?? '',
    }
  }
}
