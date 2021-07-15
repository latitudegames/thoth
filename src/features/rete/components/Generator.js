import Rete from "rete";
import { dataSocket } from "../sockets";
import { InputGeneratorControl } from "../dataControls/InputGenerator";
import { FewshotControl } from "../dataControls/FewshotControl";

export class Generator extends Rete.Component {
  constructor() {
    super("Generator");
    this.task = {
      outputs: {
        result: "output",
        data: "option",
      },
    };
  }

  builder(node) {
    const dataIn = new Rete.Input("data", "Data", dataSocket, true);
    const dataOut = new Rete.Output("data", "Data", dataSocket, true);

    const inputGenerator = new InputGeneratorControl({
      ignored: [
        {
          name: "data",
          socketType: "dataSocket",
        },
      ],
    });

    const fewshotControl = new FewshotControl({
      language: "handlebars",
    });

    node.inspector.add(inputGenerator).add(fewshotControl);

    return node.addInput(dataIn).addOutput(dataOut);
  }

  async worker(node, inputs, { element }) {}
}
