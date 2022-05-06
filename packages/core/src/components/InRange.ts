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
}
