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
} from '../../../types'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { EngineContext } from '../../engine'
import { triggerSocket, stringSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info =
  'String Combiner is used to replace a value in the string with something else - Add a new socket with the string and the value like this - Agent Replacer (will replace all the $agent from the input with the input assigned)'

type WorkerReturn = {
  output: string
}

export class InputsToJSON extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Inputs To JSON')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'I/O'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'String', stringSocket)

    const inputGenerator = new SocketGeneratorControl({
      connectionType: 'input',
      name: 'Input Sockets',
      ignored: ['trigger'],
    })

    node.inspector.add(inputGenerator)

    return node.addInput(dataInput).addOutput(dataOutput).addOutput(outp)
  }

  async worker(
    node: NodeData,
    rawInputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const inputs = Object.entries(rawInputs).reduce((acc, [key, value]) => {
      acc[key] = value[0]
      return acc
    }, {} as Record<string, unknown>)

    const data: { [key: string]: any } = {}
    for (const x in inputs) {
      data[x.toLowerCase().trim()] = inputs[x]
    }

    return {
      output: JSON.stringify(data),
    }
  }
}
