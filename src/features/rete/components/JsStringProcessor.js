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

    // Default controls
    const input = new Rete.Input("input", "Input", stringSocket);
    const dataInput = new Rete.Input("data", "Data", dataSocket);

    node.addInput(input).addInput(dataInput);

    const dataOut = new Rete.Output("data", "Data", dataSocket);
    node.addOutput(dataOut);

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
    node.inspector.add(outputGenerator);

    // Add a default javascript template if the node is new and we don't have one.
    node.data.javascript = node.data.javascript ? node.data.javascript :
          "(inputStr) => {\n    return { \"firstWord\": \"test\" }\n}";

    const javascriptControl = new JavascriptControl({
      language: "javascript",
    });
    node.inspector.add(javascriptControl);

    return node;
  }

  async worker(node, inputs, outputs) {
    const input = inputs["input"][0];

    // TODO (mitchg) - obviously this is bad, but we want this for games week. Figure out security later.
    // eslint-disable-next-line
    const stringProcessor = eval(node.data.javascript);
    return stringProcessor(input);
  }
}
