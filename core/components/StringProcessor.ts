import Rete from "rete";
import { stringSocket, triggerSocket } from "../sockets";
import { OutputGeneratorControl } from "../dataControls/OutputGenerator";
import { CodeControl } from "../dataControls/CodeControl";
import { ThothComponent } from "../thoth-component"
import { ThothNode, ThothWorkerInputs} from "../types";
const info = `The String Processor component take s astring as an input and allows you to write a function in the text editor to parse that string in whatever way you need.  You can define any number of outputs which you can pass the result of your parsing out through.

Note that the return value of your function must be an objetc whose keys match the names of your generated output sockets.`;

export class StringProcessor extends ThothComponent {
  constructor() {
    // Name of the component
    super("String Processor");

    this.task = {
      outputs: { trigger: "option" },
      init: (task) => { },
    };
    this.category = "Logic";
    this.info = info;
  }

  node = {};

  builder(node: ThothNode) {
    // Add a default javascript template if the node is new and we don't have one.
    if (!node.data.code)
      node.data.code =
        '(inputStr) => {\n    return { "outputKey": "outputValue" }\n}';

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

    return node.addInput(input).addInput(triggerIn).addOutput(triggerOut);
  }

  async worker(node: ThothNode, inputs: ThothWorkerInputs) {
    const input = inputs["input"][0];

    // TODO (mitchg) - obviously this is bad, but we want this for games week. Figure out security later.
    const code = node.data.code as string
    // eslint-disable-next-line
    const stringProcessor = eval(code);
    const outputs = stringProcessor(input);

    // Note: outputGenerator lower-cases the output connection name,
    // but end-users shouldn't be aware of this.  When they write
    // their javascript snippet, it should return a dict with the keys
    // they typed in, then we lower-case the keys for them.
    const lowerCasedOutputs = Object.keys(outputs).reduce((prev, key) => {
      return { ...prev, [key.toLowerCase()]: outputs[key] };
    }, {});

    return lowerCasedOutputs;
  }
}
