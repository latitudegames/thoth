import Rete from "rete";
import { TextInputControl } from "../controls/TextInputControl";
import { stringSocket } from "../sockets";

const info = `The info component has a single control, an input field.  Whatever value you put into this input field will be sent out along the compoonents output socket.`;

export class ModuleInput extends Rete.Component {
  task: object;
  module: object;
  category: string;
  info: string;

  constructor() {
    // Name of the component
    super("Module Input");

    this.task = {
      outputs: {
        text: "output",
      },
    };

    this.module = {
      nodeType: "input",
      socket: stringSocket,
    };

    this.category = "I/O";
    this.info = info;
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have grabbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node) {
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const out = new Rete.Output("name", "String", stringSocket);

    // Handle default value if data is present
    const value = node.data.name ? node.data.name : "Input name here";

    // controls are the internals of the node itself
    // This default control sample has a text field.
    const input = new TextInputControl({
      emitter: this.editor,
      key: "name",
      value,
    });

    return node.addOutput(out).addControl(input);
  }

  async worker(node, inputs, outputs) {
    console.log("input worker outputs", outputs);
    return {
      text: node.data.text,
    };
  }
}
