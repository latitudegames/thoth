import Rete from 'rete'
import { v4 as uuidv4 } from 'uuid'

import { NodeData, ThothNode, ThothWorkerInputs } from '../../types'
import { InputControl } from '../dataControls/InputControl'
import { TaskOptions } from '../plugins/taskPlugin/task'
// @seang todo: convert data controls to typescript to remove this
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { anySocket, triggerSocket } from '../sockets'
import { ThothComponent } from '../thoth-component'
const info = `The module output component adds an output socket to the parent module.  It can be given a name, which is displayed on the parent.`

export class ModuleOutput extends ThothComponent {
  task: TaskOptions
  module: object
  category: string
  info: string
  contextMenuName: string

  constructor() {
    // Name of the component
    super('Module Output')
    this.contextMenuName = 'Output'

    this.task = {
      runOneInput: true,
      outputs: {
        text: 'output',
      },
    }

    this.module = {
      nodeType: 'output',
      socket: anySocket,
    }

    this.category = 'Module'
    this.info = info
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have grabbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node: ThothNode) {
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const input = new Rete.Input('input', 'String', anySocket, true)
    const socketInput = new Rete.Input(
      'trigger',
      'Trigger',
      triggerSocket,
      true
    )

    // Handle default value if data is present
    const nameInput = new InputControl({
      dataKey: 'name',
      name: 'Output name',
    })

    node.inspector.add(nameInput)
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    return node.addInput(input).addInput(socketInput)
  }

  worker(node: NodeData, inputs: ThothWorkerInputs) {
    const text = inputs.input.filter(Boolean)[0] as string

    return {
      text,
    }
  }
}
