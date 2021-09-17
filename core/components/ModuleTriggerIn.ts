import Rete from "rete";
import { InputControl } from "../dataControls/InputControl";
import { triggerSocket } from "../sockets";
import { v4 as uuidv4 } from "uuid";
import { ThothComponent, ThothTask } from "../thoth-component"
import { NodeData, ThothNode, ThothWorkerInputs, ThothWorkerOutputs } from "../types";
import { TaskOptions } from "../plugins/taskPlugin/task";
const info = `The module trigger in adds a trigger input socket to the parent module.  It can be given a name, which is displayed on the parent.`;

export class ModuleTriggerIn extends ThothComponent {
  task: TaskOptions;
  module: object;
  category: string;
  info: string;
  workspaceType: "module" | "spell";
  contextMenuName: string;
  nodeTaskMap: Record<number, ThothTask> = {};

  constructor() {
    // Name of the component
    // If name of component changes please update module-manager workerModule code
    super("Module Trigger In");
    this.contextMenuName = "Trigger In";

    this.task = {
      outputs: {
        trigger: "option",
      }
    }

    this.module = {
      nodeType: "triggerIn",
      socket: triggerSocket,
    };

    this.category = "Module";
    this.info = info;
    this.workspaceType = "module";
  }

  async run(node: ThothNode, data: NodeData) {
    const task = this.nodeTaskMap[node.id];
    await task.run(data);
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have grabbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node: ThothNode) {
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const out = new Rete.Output("trigger", "Trigger", triggerSocket);
    node.data.socketKey = node?.data?.socketKey || uuidv4();

    // Handle default value if data is present
    const nameInput = new InputControl({
      dataKey: "name",
      name: "Trigger name",
    });

    node.inspector.add(nameInput);

    return node.addOutput(out);
  }

  async worker(node: NodeData, inputs: ThothWorkerInputs, outputs: ThothWorkerOutputs) {
    console.log("trigger worker outputs", outputs);
    return {};
  }
}
