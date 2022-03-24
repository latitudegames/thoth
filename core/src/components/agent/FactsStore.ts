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

const info = 'Facts Store is used to store facts for an agent and user'
export class FactsStore extends ThothComponent<Promise<void>> {
  constructor() {
    super('Facts Store')

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
    const factInp = new Rete.Input('fact', 'Fact', anySocket)
    const channelInp = new Rete.Input('channel', 'Channel', stringSocket)
    const clientInp = new Rete.Input('client', 'Client', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node
      .addInput(factInp)
      .addInput(agentInput)
      .addInput(channelInp)
      .addInput(clientInp)
      .addInput(speakerInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const speaker = (inputs['speaker'][0] || inputs['speaker']) as string
    const agent = (inputs['agent'][0] || inputs['agent']) as string
    const facts = inputs['fact'] && (inputs['fact'][0] as string)

    const channel = (inputs['channel'][0] || inputs['channel']) as string
    const client = (inputs['client'][0] || inputs['client']) as string

    console.log('Storing facts', facts)
    const rootUrl =
      process.env.REACT_APP_API_ROOT_URL ??
      process.env.API_ROOT_URL ??
      'http://localhost:8001'

    console.log('rootUrl is', rootUrl)

    if (!facts)
      return !silent
        ? node.display('No facts stored')
        : console.log('Ignoring fact storage, facts empty')
    const response = await axios.post(`${rootUrl}/facts`, {
      agent,
      speaker,
      facts,
      channel,
      client,
    })
    if (!silent) node.display(response)
    console.log(response)
  }
}
