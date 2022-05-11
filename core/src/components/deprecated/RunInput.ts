import Rete, { Control } from 'rete'

import { NodeData, ThothNode } from '../../../types'
import { RunButtonControl } from '../../controls/RunButtonControl'
import { TextInputControl } from '../../controls/TextInputControl'
import { Task } from '../../plugins/taskPlugin/task'
import { stringSocket, triggerSocket } from '../../sockets'
import { ThothComponent, ThothTask } from '../../thoth-component'
const info = `The Input With Run component lets you input a value into the provided input field, and trigger off your spell graph to run with that value passed out its output. May be depricated in favor of using the playtest input component.`

type WorkerReturn = {
  text: string
}

export class RunInputComponent extends ThothComponent<WorkerReturn> {
  initialTask?: Task
  subscriptionMap: any

  constructor() {
    // Name of the component
    super('Input With Run')

    this.subscriptionMap = {}

    this.task = {
      outputs: {
        text: 'output',
        trigger: 'option',
      },
      init: (task: ThothTask, node: ThothNode) => {
        // we only want one subscription present per node
        if (this.subscriptionMap[node.id]) {
          this.subscriptionMap[node.id]()
          delete this.subscriptionMap[node.id]
        }

        // subscribe to the run function
        // TODO abstract this into something more reusable.
        // maybe modifyy the task plugin to set a run function to the node itself?
        // const unsubscribe = this.editor?.on('run', args => {
        //   if (args.nodeId === node.id) {
        //     task.run()
        //   }
        // })

        // this.subscriptionMap[node.id] = unsubscribe
      },
    }
    this.category = 'I/O'
    this.deprecated = true
    this.deprecationMessage =
      'This component has been deprecated.  Please remove it fromall spells.  It can be replaced generally with the universal input component found under the name "Input" in the IO category.  You can use the playtest toggle to receive a value from the playtest which will trigger a run command.'
    this.info = info
  }

  // from lifecycle plugin
  destroyed(node: ThothNode) {
    // Cleanup subscriptions on the node
    if (!this.subscriptionMap[node.id]) return
    const unsubscribe = this.subscriptionMap[node.id]
    unsubscribe()
    delete this.subscriptionMap[node.id]
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have grabbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node: ThothNode) {
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const out = new Rete.Output('text', 'String', stringSocket)
    const data = new Rete.Output('trigger', 'Trigger', triggerSocket)

    // controls are the internals of the node itself
    // This default control sample has a text field.
    const input = new TextInputControl({
      editor: this.editor,
      key: 'text',
      value: node.data.text || 'Input text',
    })

    const run = new RunButtonControl({
      emitter: this.editor,
      key: 'run',
      run: node,
    })

    return node
      .addOutput(out)
      .addOutput(data)
      .addControl(input)
      .addControl(run as Control)
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  worker(node: NodeData) {
    return {
      text: node.data.text as string,
    }
  }
}
