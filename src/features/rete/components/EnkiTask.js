import Rete from "rete";
import { EnkiOutputControl } from "../dataControls/EnkiOutputControl";
import { anySocket, dataSocket } from "../sockets";

export class EnkiTask extends Rete.Component {
  constructor() {
    // Name of the component
    super("Enki Task");

    this.task = {
      outputs: { data: "option" },
    };
  }

  node = {};

  builder(node) {

    const EnkiOutput = new EnkiOutputControl({
        defaultOutputs: node.data.outputs,
        socketType: "dataSocket",
        taskType: "option",
      });

      node.inspector.add(EnkiOutput);

    //   const input = new Rete.Input("input", "Input", anySocket);
    // const dataInput = new Rete.Input("data", "Data", dataSocket);

    // node.addInput(input).addInput(dataInput);

    return node;
  }

  async worker(node, inputs, outputs) {
    return {
      taskOutputs: "",
    };
  }
}
