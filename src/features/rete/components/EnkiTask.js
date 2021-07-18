import Rete from "rete";
import { EnkiThroughputControl } from "../dataControls/EnkiThroughputControl";
import { postEnkiCompletion } from "../../../services/game-api/enki";
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
    const EnkiOutput = new EnkiThroughputControl({
      defaultOutputs: node.data.outputs,
      socketType: "dataSocket",
      taskType: "option",
      nodeId: node.id,
    });

    node.inspector.add(EnkiOutput);

    return node;
  }

  async worker(node, inputs, outputs) {
    const completionResponse = await postEnkiCompletion(
      node.data.name,
      Object.values(inputs).map((inputArray) => inputArray[0])
    );
    let compiledOutputs;

    Object.keys(node.outputs).forEach((outputName, outputNumber) => {
      compiledOutputs[outputName] = completionResponse[outputNumber];
    });
    return compiledOutputs;
  }
}
