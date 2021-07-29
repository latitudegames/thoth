import Rete from "rete";
import { EnkiThroughputControl } from "../dataControls/EnkiThroughputControl";
import { postEnkiCompletion } from "../../../services/game-api/enki";

const info = `Enki is a tool for building both fewshots, as well as entire data sets.  The enki component allows you to select an enki which you or someone else has made in the Enki tool and utilize it in your spell chains.

Due to current limitations in data structure, the enki inputs and outputs are unnamed, so you will have to know the order of them and what to use them for by referencing their usage in Enki.`;
export class EnkiTask extends Rete.Component {
  constructor() {
    // Name of the component
    super("Enki Task");

    this.task = {
      outputs: { trigger: "option" },
    };
    this.category = "AI/ML";
    this.display = true;
    this.info = info;
  }

  node = {};

  builder(node) {
    const EnkiOutput = new EnkiThroughputControl({
      defaultOutputs: node.data.outputs,
      name: "Enki",
      socketType: "stringSocket",
      taskType: "output",
      nodeId: node.id,
    });

    node.inspector.add(EnkiOutput);

    return node;
  }

  async worker(node, inputs, outputs, { silent }) {
    const completionResponse = await postEnkiCompletion(
      node.data.name,
      Object.values(inputs).map((inputArray) => inputArray[0])
    );

    // handle this better
    if (
      !completionResponse?.outputs ||
      completionResponse.outputs.length === 0
    ) {
      return null;
    }

    const test = completionResponse.outputs.reduce(
      (compiledOutputs, output, outputNumber) => {
        compiledOutputs[`output${outputNumber + 1}`] = output;
        return compiledOutputs;
      },
      {}
    );

    // console.log("test", test);
    // console.log(this.node.task);

    if (!silent) node.display(completionResponse.outputs.join(" "));

    return test;
  }
}
