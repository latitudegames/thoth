import Rete from 'rete'
// @seang todo: convert data controls to typescript to remove this
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { v4 as uuidv4 } from 'uuid'

import { NodeData, ThothNode } from '../../types'
import { InputControl } from '../dataControls/InputControl'
import { TaskOptions } from '../plugins/taskPlugin/task'
import { triggerSocket } from '../sockets'
import { ThothComponent, ThothTask } from '../thoth-component'
const info = `The trigger in allows you to pass values into your spell either from a higher level component or from the server.  There must be one single trigger into a spell for now as the server does not support multiple triggers.  Yet.`

export class TriggerIn extends ThothComponent<void> {
  task: TaskOptions
  category: string
  info: string
  contextMenuName: string
  nodeTaskMap: Record<number, ThothTask> = {}

  constructor() {
    // Name of the component
    // If name of component changes please update module-manager workerModule code
    super('Module Trigger In')
    this.displayName = 'Trigger In'
    this.contextMenuName = 'Trigger In'

    this.task = {
      outputs: {
        trigger: 'option',
      },
      init: (task: ThothTask, node: ThothNode) => {
        // store the nodes task inside the component
        this.nodeTaskMap[node.id] = task
      },
    }

    this.module = {
      nodeType: 'triggerIn',
      socket: triggerSocket,
    }

    this.category = 'I/O'

    this.info = info
  }

  async run(node: ThothNode, data: NodeData) {
    if (!node || node === undefined) {
      throw new Error('node is undefined')
    }

    const task = this.nodeTaskMap[node?.id]
    if (task) await task.run(data)
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have grabbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node: ThothNode) {
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const out = new Rete.Output('trigger', 'Trigger', triggerSocket)
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    // Handle default value if data is present
    const nameInput = new InputControl({
      dataKey: 'name',
      name: 'Trigger name',
    })

    node.inspector.add(nameInput)

    return node.addOutput(out)
  }

  worker() {
    return {}
  }
}
