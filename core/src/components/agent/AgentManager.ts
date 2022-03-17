import axios from 'axios'
import Rete from 'rete'

/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../../types'
import { InputControl } from '../../dataControls/InputControl'
import { EngineContext } from '../../engine'
import { triggerSocket, anySocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info = 'Archive Conversation is used to archive old conversation'
// TODO: Update this
const serverUrl =
  process.env.REACT_APP_API_ROOT_URL ??
  process.env.API_URL ??
  'http://localhost:8001'

type WorkerReturn = {
  name: string
  personality: string
}

export class AgentManager extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Get Agent Personality')

    this.task = {
      outputs: {
        // output: 'output',
        trigger: 'option',
        name: 'name',
        personality: 'personality',
      },
    }

    this.category = 'Agents'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const outName = new Rete.Output('agent', 'Name', anySocket)
    const outPersonality = new Rete.Output(
      'personality',
      'Personality',
      anySocket
    )
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    const personality = new InputControl({
      dataKey: 'personality',
      name: 'Personality',
      icon: 'moon',
    })

    node.inspector.add(personality)

    return (
      node
        .addOutput(outName)
        // .addOutput(outDialog)
        .addOutput(outPersonality)
        // .addOutput(outMoral)
        // .addOutput(outMonologue)
        // .addOutput(outFact)
        // .addOutput(outGreeting)
        .addInput(dataInput)
        .addOutput(dataOutput)
    )
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const personality = node?.data?.personality as string
    console.log('personality is', personality)

    const res = await axios.get(`${serverUrl}/agent?agent=${personality}`)
    console.log('res is', res)
    const agent = res.data.agent

    return {
      name: agent ?? res.data.name ?? res.data.personality ?? 'testestest',
      agent: agent,
      personality: 'test2',
    }
  }
}
