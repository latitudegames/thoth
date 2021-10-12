import Rete from 'rete'
// @seang todo: convert data controls to typescript to remove this
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { v4 as uuidv4 } from 'uuid'

import { ThothNode } from '../../types'
import { InputControl } from '../dataControls/InputControl'
import { TaskOptions } from '../plugins/taskPlugin/task'
import { triggerSocket } from '../sockets'
import { ThothComponent } from '../thoth-component'
const info = `The module trigger out component adds a trigger out socket to the parent module.  It can be given a name, which is displayed on the parent.`

export class ModuleTriggerOut extends ThothComponent {
  task: TaskOptions
  module: object
  category: string
  info: string
  contextMenuName: string

  constructor() {
    // Name of the component
    super('Module Trigger Out')
    this.contextMenuName = 'Trigger Out'

    this.task = {
      outputs: {
        trigger: 'output',
      },
    }

    this.module = {
      nodeType: 'triggerOut',
      socket: triggerSocket,
    }

    this.category = 'Module'
    this.info = info
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have grabbed all few shots, we would use the builder
  // to generate the appropriate inputs and outputs for the fewshot at build time
  builder(node: ThothNode) {
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const input = new Rete.Input('trigger', 'Trigger', triggerSocket)

    // Handle default value if data is present
    const nameInput = new InputControl({
      dataKey: 'name',
      name: 'Trigger name',
    })

    node.inspector.add(nameInput)
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    return node.addInput(input)
  }

  worker() {
    return {
      trigger: true,
    }
  }
}
