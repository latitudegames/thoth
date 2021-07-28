import Rete from "rete";
import { TextInputControl } from "../controls/TextInputControl";
import { InputControl } from "../dataControls/InputControl";
import { stringSocket } from "../sockets";

const info = `The module input component adds an input socket to the parent module.  It can be given a name, which is displayed on the parent.`;

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
    const nameInput = new InputControl({
      dataKey: "name",
      name: "Input name",
    });

    node.inspector.add(nameInput);

    return node.addOutput(out);
  }

  async worker(node, inputs, outputs) {
    console.log("input worker outputs", outputs);
    return {
      text: node.data.text,
    };
  }
}
