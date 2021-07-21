import Rete from "rete";
import { dataSocket } from "../sockets";
import { OutputGeneratorControl } from "../dataControls/OutputGenerator";
import { InputGeneratorControl } from "../dataControls/InputGenerator";

export class Code extends Rete.Component {
  constructor() {
    // Name of the component
    super("Code");

    this.task = {
      outputs: {},
    };
  }

  builder(node) {
    const outputGenerator = new OutputGeneratorControl({
      ignored: [
        {
          name: "data",
          socketType: "dataSocket",
        },
      ],
    });

    const inputGenerator = new InputGeneratorControl({
      ignored: [
        {
          name: "data",
          socketType: "dataSocket",
        },
      ],
    });

    node.inspector.add(outputGenerator).add(inputGenerator);

    const dataInput = new Rete.Input("data", "Data", dataSocket);
    const dataOutput = new Rete.Output("data", "Data", dataSocket);

    node.addOutput(dataOutput).addInput(dataInput);
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  async worker(node, inputs, data) {}
}
