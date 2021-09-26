import Rete from 'rete'

import { EngineContext } from '../engine'
import { Task } from '../plugins/taskPlugin/task'
import { triggerSocket, stringSocket } from '../sockets'
import { ThothComponent } from '../thoth-component'
import {
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../types'
const info = `The Playtest Input component is connected to the playtest window. It received anything which is type dinto the playtest areavia the input and will trigger the running of your spell chain.`
export class PlaytestInput extends ThothComponent {
  initialTask?: Task

  constructor() {
    // Name of the component
    super('Playtest Input')

    this.task = {
      outputs: {
        text: 'output',
        trigger: 'option',
      },
      init: (task = {} as Task) => {
        this.initialTask = task
      },
    }

    this.category = 'I/O'
    this.display = true
    this.info = info
  }

  subscriptionMap: Record<string, Function> = {}

  unsubscribe?: () => void

  subscribeToPlaytest(node: ThothNode) {
    const { onPlaytest } = this.editor?.thothV2 as EngineContext

    if (onPlaytest) {
      // store the unsubscribe function in our node map
      this.subscriptionMap[node.id] = onPlaytest((text: string) => {
        // attach the text to the nodes data for access in worker
        node.data.text = text

        // will need to run this here with the stater rather than the text
        this.initialTask?.run(text)
        this.initialTask?.reset()
        this.editor?.trigger('process')
      })
    }
  }

  destroyed(node: ThothNode) {
    if (this.subscriptionMap[node.id]) this.subscriptionMap[node.id]()
    delete this.subscriptionMap[node.id]
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have garbbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node: ThothNode) {
    if (this.subscriptionMap[node.id]) this.subscriptionMap[node.id]()
    delete this.subscriptionMap[node.id]

    // create inputs here. First argument is th ename, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const textOutput = new Rete.Output('text', 'Text', stringSocket)

    this.subscribeToPlaytest(node)

    return node.addOutput(textOutput).addOutput(dataOutput)
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connecte components
  worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, data }: { silent: boolean; data: string }
  ) {
    if (!silent) node.display(data)

    return {
      text: data,
    }
  }
}
