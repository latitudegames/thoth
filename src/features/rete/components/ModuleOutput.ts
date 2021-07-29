import Rete from "rete";
import { InputControl } from "../dataControls/InputControl";
import { anySocket } from "../sockets";

const info = `The module output component adds an output socket to the parent module.  It can be given a name, which is displayed on the parent.`;

export class ModuleOutput extends Rete.Component {
  task: object;
  module: object;
  category: string;
  info: string;
  workspaceType: "module" | "spell";
  contextMenuName: string;

  constructor() {
    // Name of the component
    super("Module Output");
    this.contextMenuName = "Output";

    this.task = {
      outputs: {
        text: "output",
      },
    };

    this.module = {
      nodeType: "output",
      socket: anySocket,
    };

    this.category = "Module";
    this.info = info;
    this.workspaceType = "module";
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have grabbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node) {
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const input = new Rete.Input("output", "String", anySocket);

    // Handle default value if data is present
    const nameInput = new InputControl({
      dataKey: "name",
      name: "Output name",
    });

    node.inspector.add(nameInput);

    return node.addInput(input);
  }

  async worker(node, inputs, outputs) {
    console.log("output worker outputs", outputs);
    return {
      text: node.data.text,
    };
  }
}
