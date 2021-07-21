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
          name: "data",
          socketType: "dataSocket",
          taskType: "option",
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

  async worker(node, inputs, data) {
    const input = inputs["input"][0];

    // TODO (mitchg) - obviously this is bad, but we want this for games week. Figure out security later.
    // eslint-disable-next-line
    const stringProcessor = eval(node.data.javascript);
    const outputs = stringProcessor(input);

    // Note: outputGenerator lower-cases the output connection name,
    // but end-users shouldn't be aware of this.  When they write
    // their javascript snippet, it should return a dict with the keys
    // they typed in, then we lower-case the keys for them.
    const lowerCasedOutputs = {};
      Object.keys(outputs).map((key) => {lowerCasedOutputs[key.toLowerCase()] = outputs[key];});

    return lowerCasedOutputs;
  }
}
