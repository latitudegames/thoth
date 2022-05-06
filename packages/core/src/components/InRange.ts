import Rete from 'rete'

import { NodeData, ThothNode, ThothWorkerInputs } from '../../types'
import { triggerSocket, numSocket } from '../sockets'
import { ThothComponent } from '../thoth-component'

const info = `The In Range component takes either a manually input set of numbers or a dynamically generated set of numbers as a boundary. When supplied with a value to test its existance between the set range, will trigger 1 of 2 outputs. If the number exists within the range including the start and end number, will trigger the true output else will trigger the false output.`

export class InRange extends ThothComponent<void> {
  constructor() {
    super('In Range')

    this.task = {
      outputs: { true: 'option', false: 'option' },
    }
    this.category = 'Logic'
    this.info = info
  }

  builder(node: ThothNode) {
    const startNumSocket = new Rete.Input(
      'number',
      'Start Number',
      numSocket,
      false
    )
    const endNumSocket = new Rete.Input(
      'number',
      'End Number',
      numSocket,
      false
    )
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const testInput = new Rete.Input('input', 'Input', numSocket)

    const isTrue = new Rete.Output('true', 'True', triggerSocket)
    const isFalse = new Rete.Output('false', 'False', triggerSocket)

    return node
      .addInput(startNumSocket)
      .addInput(endNumSocket)
      .addInput(dataInput)
      .addInput(testInput)
      .addOutput(isTrue)
      .addOutput(isFalse)
  }

  worker(node: NodeData, inputs: ThothWorkerInputs) {
    const startRange =
      (inputs['number'][0] as number) ?? (node.data.startNumber as number)
    const endRange =
      (inputs['number'][1] as number) ?? (node.data.endNumber as number)
    const numberToTest = inputs['input'][0] as number

    }
  }
}
