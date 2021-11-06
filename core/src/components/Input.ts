import Rete from 'rete'
import { v4 as uuidv4 } from 'uuid'

import {
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../types'
import { TextInputControl } from '../controls/TextInputControl'
import { InputControl } from '../dataControls/InputControl'
import { PlaytestControl } from '../dataControls/PlaytestControl'
import { EngineContext } from '../engine'
import { Task } from '../plugins/taskPlugin/task'

import { anySocket } from '../sockets'
import { ThothComponent, ThothTask } from '../thoth-component'
const info = `The input component allows you to pass a single value to your chain.  You can set a default value to fall back to if no value is provided at runtim.  You can also turn the input on to receive data from the playtest input.`

type InputReturn = {
  output: unknown
}

export class InputComponent extends ThothComponent<InputReturn> {
  nodeTaskMap: Record<number, ThothTask> = {}

  constructor() {
    // Name of the component
    super('Input')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
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
    this.display = true
  }

  subscriptionMap: Record<string, Function> = {}

  unsubscribe?: () => void

  subscribeToPlaytest(node: ThothNode) {
    const { onPlaytest } = this.editor?.thoth as EngineContext

    // check node for the right data attribute
    if (onPlaytest) {
      // store the unsubscribe function in our node map
      this.subscriptionMap[node.id] = onPlaytest((text: string) => {
        // if the node doesnt have playtest toggled on, do nothing
        const playtestToggle = node.data.playtestToggle as unknown as {
          receivePlaytest: boolean
        }
        if (!playtestToggle.receivePlaytest) return

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

  destroyed(node: ThothNode) {
    if (this.subscriptionMap[node.id]) this.subscriptionMap[node.id]()
    delete this.subscriptionMap[node.id]
  }

  builder(node: ThothNode) {
    if (this.subscriptionMap[node.id]) this.subscriptionMap[node.id]()
    delete this.subscriptionMap[node.id]

    // subscribe the node to the playtest input data stream
    this.subscribeToPlaytest(node)

    const out = new Rete.Output('output', 'output', anySocket)

    const nameInput = new InputControl({
      dataKey: 'name',
      name: 'Input name',
    })

    const data = node.data as { receivePlaytest: boolean }

    const togglePlaytest = new PlaytestControl({
      dataKey: 'receivePlaytest',
      name: 'Receive from playtest input',
      defaultValue: data.receivePlaytest || false,
      label: 'Toggle playtest',
    })

    node.inspector.add(nameInput).add(togglePlaytest)

    const value = node.data.text ? node.data.text : 'Input text here'
    const input = new TextInputControl({
      emitter: this.editor,
      key: 'text',
      value,
      label: 'Default value',
    })

    // module components need to have a socket key.
    // todo add this somewhere automated? Maybe wrap the modules builder in the plugin
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    return node.addOutput(out).addControl(input)
  }

  worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, data }: { silent: boolean; data: string | undefined }
  ) {
    this._task.closed = ['trigger']

    // handle data subscription
    if (data && node.data.receivePlaytest) {
      this._task.closed = []

      if (!silent) node.display(data)
      return {
        output: data,
      }
    }

    // If there are outputs, we are running as a module input and we use that value
    if (outputs.output && !outputs?.output.task) {
      return outputs as { output: unknown }
    }

    return {
      output: node.data.text as string,
    }
  }
}
