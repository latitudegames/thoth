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
import { triggerSocket, stringSocket } from '../sockets'
import { ThothComponent } from '../thoth-component'

const info = 'String Adder adds a string in the current input.'

type WorkerReturn = {
  output: string
}

export class StringAdder extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    super('String Adder')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Logic'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const inp = new Rete.Input('string', 'String', stringSocket)
    const newInput = new Rete.Input('newInput', 'New Input', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'String', stringSocket)

    const operationType = new InputControl({
      dataKey: 'newLineStarting',
      name: 'New Line Starting',
      icon: 'moon',
    })

    node.inspector.add(operationType)

    return node
      .addInput(inp)
      .addInput(newInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(outp)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const input = inputs['string'][0] as string
    const newInput = inputs['newInput'][0] as string
    const newLineStarting = node?.data?.newLineStarting as string

    return {
      output: input + (newLineStarting ?? '') + newInput,
    }
  }
}
