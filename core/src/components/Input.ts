import Rete from 'rete'

import {
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../types'
import { TextInputControl } from '../controls/TextInputControl'
import { InputControl } from '../dataControls/InputControl'
import { EngineContext } from '../engine'
import { Task } from '../plugins/taskPlugin/task'

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
      init: (task = {} as Task, node: ThothNode) => {
        this.nodeTaskMap[node.id] = task
      },
    }

    this.module = {
      nodeType: 'input',
      socket: anySocket,
    }

    this.category = 'I/O'
    this.info = info
  }

  subscriptionMap: Record<string, Function> = {}
  subscribeToPlaytest(node: ThothNode) {
    const { onPlaytest } = this.editor?.thoth as EngineContext

    // check node for the right data attribute
    if (onPlaytest) {
      // store the unsubscribe function in our node map
      this.subscriptionMap[node.id] = onPlaytest((text: string) => {
        // attach the text to the nodes data for access in worker
        node.data.text = text

        const task = this.nodeTaskMap[node.id]

        // will need to run this here with the stater rather than the text
        task?.run(text)
        task?.reset()
        this.editor?.trigger('process')
      })
    }
  }
  builder(node: ThothNode) {
    if (this.subscriptionMap[node.id]) this.subscriptionMap[node.id]()
    delete this.subscriptionMap[node.id]

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
