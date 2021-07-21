import Rete from "rete";
import { stringSocket, dataSocket } from "../sockets";
import { OutputGeneratorControl } from "../dataControls/OutputGenerator";
import { JavascriptControl } from "../dataControls/JavascriptControl";

export class JsStringProcessor extends Rete.Component {
  constructor() {
    // Name of the component
    super("JS String Processor");

    this.task = {
      outputs: { data: "option" },
    };
  }

  node = {};

  builder(node) {

    // Add a default javascript template if the node is new and we don't have one.
    node.data.javascript = node.data.javascript ? node.data.javascript :
          "(inputStr) => {\n    return { \"outputKey\": \"outputValue\" }\n}";

    // Rete controls
    const input = new Rete.Input("input", "Input", stringSocket);
    const dataInput = new Rete.Input("data", "Data", dataSocket);
    const dataOut = new Rete.Output("data", "Data", dataSocket);

    // Inspector controls
    const outputGenerator = new OutputGeneratorControl({
      socketType: "stringSocket",
      taskType: "output",
      ignored: [
        {
          name: "Data",
          socketType: "dataSocket",
        },
      ],
    });

    const javascriptControl = new JavascriptControl({
      language: "javascript",
    });

    node.inspector.add(outputGenerator);
    node.inspector.add(javascriptControl);

    return node
        .addInput(input)
        .addInput(dataInput)
        .addOutput(dataOut);
  }

  async worker(node, inputs, outputs) {
    const input = inputs["input"][0];

    // TODO (mitchg) - obviously this is bad, but we want this for games week. Figure out security later.
    // eslint-disable-next-line
    const stringProcessor = eval(node.data.javascript);
    return stringProcessor(input);
  }
}
