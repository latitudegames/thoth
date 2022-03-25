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
import { DropdownControl } from '../../controls/DropdownControl'
import { InputControl } from '../../dataControls/InputControl'
import { EngineContext } from '../../engine'
import { triggerSocket, anySocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info = 'Get Agent Personality'
// TODO: Update this
const serverUrl =
  process.env.REACT_APP_API_ROOT_URL ??
  process.env.API_URL ??
  'http://localhost:8001'

type WorkerReturn = {
  name: string
  personality: string
}

export class GetAgentPersonality extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Get Agent Personality')

    this.task = {
      outputs: {
        output: 'output',
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
    const value = node.data.text ? node.data.text : 'Select Value'

    const inputDropdown = new DropdownControl({
      editor: this.editor,
      key: 'Personality',
      value,
    })

    const dataInput = new Rete.Input(
      'trigger',
      'Trigger In',
      triggerSocket,
      true
    )
    const dataOutput = new Rete.Output('trigger', 'Trigger Out', triggerSocket)
    const outDialog = new Rete.Output('dialog', 'Dialog', anySocket)
    const outMoral = new Rete.Output(
      'morals and Ethics',
      'Morals and Ethics',
      anySocket
    )
    const outMonologue = new Rete.Output('monologue', 'Monologue', anySocket)
    const outGreeting = new Rete.Output('greetings', 'Greetings []', anySocket)

    const personality = new InputControl({
      dataKey: 'personality',
      name: 'Personality',
      icon: 'moon',
    })

    node.inspector.add(personality)

    return node
      .addOutput(outName)
      .addOutput(outDialog)
      .addOutput(outPersonality)
      .addOutput(outMoral)
      .addOutput(outMonologue)
      .addOutput(outGreeting)
      .addOutput(dataOutput)
      .addControl(inputDropdown)
      .addInput(dataInput)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    console.log('Handling ', node?.data)
    console.log('serverUrl is', serverUrl)

    const pernalityName = localStorage.getItem('pernalityName')
    console.log('personality is', pernalityName)

    // const res = await axios.get(`${serverUrl}/agent?agent=${personality}`)

    const res = await axios.get(`${serverUrl}/agent_data`, {
      params: { agent: pernalityName },
    })

    node.display(res && res.data && res.data.agent)
    const agent = res.data.agent
    return {
      name: agent ?? res.data.name ?? res.data.personality ?? 'testestest',
      agent: agent,
      personality: 'test2',
    }
  }
}
