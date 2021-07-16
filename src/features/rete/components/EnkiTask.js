import Rete from "rete";
import { EnkiSelectControl } from "../dataControls/EnkiControl";
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

    const EnkiSelect = new EnkiSelectControl({
        defaultOutputs: node.data.outputs,
        socketType: "dataSocket",
        taskType: "option",
      });

      node.inspector.add(EnkiSelect);

      const input = new Rete.Input("input", "Input", anySocket);
    const dataInput = new Rete.Input("data", "Data", dataSocket);

    node.addInput(input).addInput(dataInput);

    return node;
  }

  async worker(node, inputs, outputs) {
    return {
      taskOutputs: "",
    };
  }
}
