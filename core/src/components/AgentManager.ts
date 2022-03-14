/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'

import {
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../types'
import { InputControl } from '../dataControls/InputControl'
import { EngineContext } from '../engine'
import { triggerSocket, stringSocket, anySocket } from '../sockets'
import { ThothComponent } from '../thoth-component'

const info = 'Archive Conversation is used to archive old conversation'

type WorkerReturn = {
  output: string
}

export class AgentManager extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Get Agent Personality')

    this.task = {
      outputs: {
        // output: 'output',
        // trigger: 'option',
        name: 'output',
        dialog: 'option',
        personality: '',
        morals: '',
        monologue: '',
        facts: '',
        greetings: [],
      },
    }

    this.category = 'I/O'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const agentInput = new Rete.Input('agent', 'Agent', stringSocket)
    const speakerInput = new Rete.Input('speaker', 'Speaker', stringSocket)
    const inp = new Rete.Input('string', 'Fact', stringSocket)
    const outName = new Rete.Output('name', 'Name', anySocket)
    const outDialog = new Rete.Output('dialog', 'Dialog', anySocket)
    const outPersonality = new Rete.Output('personality', 'Personality', anySocket)
    const outMoral = new Rete.Output('morals and Ethics', 'Morals and Ethics', anySocket)
    const outMonologue = new Rete.Output('monologue', 'Monologue', anySocket)
    const outFact = new Rete.Output('fact', 'Fact', anySocket)
    const outGreeting = new Rete.Output('greetings', 'Greetings', anySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    const messageCount = new InputControl({
      dataKey: 'messageCount',
      name: 'Message Count',
      icon: 'moon',
    })

    node.inspector.add(messageCount)

    return node
      .addInput(inp)
      .addInput(agentInput)
      .addInput(speakerInput)
      .addInput(dataInput)
      .addOutput(outName)
      .addOutput(outDialog)
      .addOutput(outPersonality)
      .addOutput(outMoral)
      .addOutput(outMonologue)
      .addOutput(outFact)
      .addOutput(outGreeting)
      .addOutput(dataOutput)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const action = inputs['string'][0] as string
    const messageCountData = node?.data?.messageCount as string
    const messageCount = messageCountData ? parseFloat(messageCountData) : 10

    console.log(messageCount)
    //send post request

    return {
      output: action,
    }
  }
}
