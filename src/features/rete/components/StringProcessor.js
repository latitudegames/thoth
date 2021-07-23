import Rete from "rete";
import { stringSocket, triggerSocket } from "../sockets";
import { OutputGeneratorControl } from "../dataControls/OutputGenerator";
import { CodeControl } from "../dataControls/CodeControl";

export class StringProcessor extends Rete.Component {
  constructor() {
    // Name of the component
    super("String Processor");

    this.task = {
      outputs: { trigger: "option" },
    };
    this.category = "Logic";
  }

  node = {};

  builder(node) {

    // Add a default javascript template if the node is new and we don't have one.
      if(!node.data.code) node.data.code =  "(inputStr) => {\n    return { \"outputKey\": \"outputValue\" }\n}";

    // Rete controls
    const input = new Rete.Input("input", "Input", stringSocket);
    const triggerIn = new Rete.Input("trigger", "Trigger", triggerSocket);
    const triggerOut = new Rete.Output("trigger", "Trigger", triggerSocket);

    // Inspector controls
    const outputGenerator = new OutputGeneratorControl({
      socketType: "stringSocket",
      taskType: "output",
      ignored: [
        {
          name: "trigger",
          socketType: "triggerSocket",
          taskType: "option",
        },
      ],
    });

    const codeControl = new CodeControl({
      dataKey: "code",
      name: "code",
    });

    node.inspector.add(outputGenerator);
    node.inspector.add(codeControl);

    return node
        .addInput(input)
        .addInput(triggerIn)
        .addOutput(triggerOut);
  }

  async worker(node, inputs, data) {
    const input = inputs["input"][0];

    // TODO (mitchg) - obviously this is bad, but we want this for games week. Figure out security later.
    // eslint-disable-next-line
    const stringProcessor = eval(node.data.code);
    const outputs = stringProcessor(input);

    // Note: outputGenerator lower-cases the output connection name,
    // but end-users shouldn't be aware of this.  When they write
    // their javascript snippet, it should return a dict with the keys
    // they typed in, then we lower-case the keys for them.
    const lowerCasedOutputs =
        Object.keys(outputs).reduce((prev, key) => {return {...prev, [key.toLowerCase()]: outputs[key] }; }, {});

    return lowerCasedOutputs;
  }
}
