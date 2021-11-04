import Rete from 'rete'

import {
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../types'
import { TextInputControl } from '../controls/TextInputControl'
import { InputControl } from '../dataControls/InputControl'

import { anySocket } from '../sockets'
import { ThothComponent, ThothTask } from '../thoth-component'

type InputReturn = {
  output: string | undefined
}

export class InputComponent extends ThothComponent<InputReturn> {
  nodeTaskMap: Record<number, ThothTask> = {}

  constructor() {
    // Name of the component
    super('Input')

    this.task = {
      outputs: {
        output: 'output',
      },
    }

    this.module = {
      nodeType: 'input',
      socket: anySocket,
    }

    this.category = 'I/O'
    this.info = info
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have grabbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node: ThothNode) {
    const nameInput = new InputControl({
      dataKey: 'name',
      name: 'Input name',
    })

    // Handle default value if data is present
    const value = node.data.text ? node.data.text : 'Input text here'

    // controls are the internals of the node itself
    // This default control sample has a text field.
    const input = new TextInputControl({
      emitter: this.editor,
      key: 'text',
      value,
      label: 'Default value',
    })

    return node.addOutput(out).addControl(input)
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, data }: { silent: boolean; data: string | undefined }
  ) {
    // handle data subscription
    if (data) {
      if (!silent) node.display(data)
      return {
        output: data,
      }
    }

    return {
      output: node.data.text as string,
    }
  }
}
