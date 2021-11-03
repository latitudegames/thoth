import Rete from 'rete'

import { NodeData, ThothNode } from '../../types'
import { TextInputControl } from '../controls/TextInputControl'
import { stringSocket } from '../sockets'
import { ThothComponent } from '../thoth-component'
const info = `The info component has a single control, an input field.  Whatever value you put into this input field will be sent out along the compoonents output socket.`

export class InputFieldComponent extends ThothComponent {
  constructor() {
    // Name of the component
    super('Input Field')

    this.task = {
      outputs: {
        text: 'output',
      },
    }

    this.category = 'I/O'
    this.info = info
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have grabbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node: ThothNode) {
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const out = new Rete.Output('text', 'String', stringSocket)

    // Handle default value if data is present
    const value = node.data.text ? node.data.text : 'Input text here'

    // controls are the internals of the node itself
    // This default control sample has a text field.
    const input = new TextInputControl({
      emitter: this.editor,
      key: 'text',
      value,
    })

    return node.addOutput(out).addControl(input)
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  worker(node: NodeData) {
    return {
      text: node.data.text as string,
    }
  }
}
