import Rete from "rete";
import { EnkiSelectControl } from "../dataControls/EnkiControl";

export class EnkiTask extends Rete.Component {
  constructor() {
    // Name of the component
    super("Enki Task");

    this.task = {
      outputs: { data: "option" },
    };
  }

  builder(node) {

    const EnkiSelect = new EnkiSelectControl({
        defaultOutputs: node.data.outputs,
        socketType: "dataSocket",
        taskType: "option",
      });

      node.inspector.add(EnkiSelect);

    return node;
  }

  async worker(node, inputs, outputs) {
    return {
      taskOutputs: "",
    };
  }
}
