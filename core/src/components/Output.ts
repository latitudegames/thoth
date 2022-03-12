import Rete from 'rete'
import { v4 as uuidv4 } from 'uuid'

import {
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../types'
import { InputControl } from '../dataControls/InputControl'
import { SwitchControl } from '../dataControls/SwitchControl'
import { EngineContext } from '../engine'
import { triggerSocket, anySocket } from '../sockets'
import { ThothComponent } from '../thoth-component'
const info = `The output component will pass values out from your spell.  You can have multiple outputs in a spell and all output values will be collected. It also has an option to send the output to the playtest area for easy testing.`

export class Output extends ThothComponent<void> {
  constructor() {
    super('Output')

    this.task = {
      runOneInput: true,
      outputs: {
        text: 'output',
        trigger: 'option',
      },
    }

    this.module = {
      nodeType: 'output',
      socket: anySocket,
    }

    this.category = 'I/O'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const triggerInput = new Rete.Input(
      'trigger',
      'Trigger',
      triggerSocket,
      true
    )
    const triggerOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const textInput = new Rete.Input('input', 'Outputs', anySocket, true)

    const nameInput = new InputControl({
      dataKey: 'name',
      name: 'Output name',
    })

    const switchControl = new SwitchControl({
      dataKey: 'sendToPlaytest',
      name: 'Send to Playtest',
      label: 'Playtest',
      defaultValue: node.data.sendToPlaytest || false,
    })

    node.inspector.add(switchControl).add(nameInput)
    // need to automate this part!  Wont workw without a socket key
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    return node
      .addInput(textInput)
      .addInput(triggerInput)
      .addOutput(triggerOutput)
  }

  worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    if (!inputs.input) throw new Error('No input provided to output component')

    const text = inputs.input.filter(Boolean)[0]

    //just need a new check here for playtest send boolean
    const { sendToPlaytest } = thoth

    if (node.data.sendToPlaytest && sendToPlaytest) {
      sendToPlaytest(text)
    }

    if (!silent) node.display(text as string)

    const name = node.data.name as string
    console.log(name, '- output:', text)

    return { text }
  }
}
