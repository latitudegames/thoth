import Rete from "rete";
// @seang todo: convert data controls to typescript to remove this
//@ts-ignore
import { InputControl } from "../dataControls/InputControl";
import { anySocket } from "../sockets";
import { v4 as uuidv4 } from "uuid";
import { NodeData, ThothNode, ThothWorkerInputs, ThothWorkerOutputs } from "../types";
import { ThothComponent } from "../thoth-component"
import { TaskOptions } from "../plugins/taskPlugin/task";
const info = `The module input component adds an input socket to the parent module.  It can be given a name, which is displayed on the parent.`;

export class ModuleInput extends ThothComponent {
  task: TaskOptions;
  module: object;
  category: string;
  info: string;
  workspaceType: "module" | "spell";
  contextMenuName: string;

  constructor() {
    // Name of the component
    super("Module Input");
    this.contextMenuName = "Input";
    this.task = {
      outputs: {
        output: "output",
      },
    }

    this.module = {
      nodeType: "input",
      socket: anySocket,
    };

    this.category = "Module";
    this.info = info;
    this.workspaceType = "module";
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have grabbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node: ThothNode): ThothNode {
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const out = new Rete.Output("output", "output", anySocket);

    // Handle default value if data is present
    const nameInput = new InputControl({
      dataKey: "name",
      name: "Input name",
    });

    node.inspector.add(nameInput);
    node.data.socketKey = node?.data?.socketKey || uuidv4();

    return node.addOutput(out);
  }

  worker(node: NodeData, inputs: ThothWorkerInputs, outputs: ThothWorkerOutputs) {
    console.log("input worker outputs", outputs);
    // outputs in this case is a key value object of outputs.
    // perfect for task return
    return outputs;
  }
}
