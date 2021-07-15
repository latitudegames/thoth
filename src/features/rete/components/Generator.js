import Rete from "rete";
import Handlebars from "handlebars";
import { dataSocket, stringSocket } from "../sockets";
import { InputGeneratorControl } from "../dataControls/InputGenerator";
import { FewshotControl } from "../dataControls/FewshotControl";
import { completion } from "../../../utils/openaiHelper";

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
    const resultOut = new Rete.Output("result", "Result", stringSocket, true);

    const inputGenerator = new InputGeneratorControl({
      ignored: [
        {
          name: "Data",
          socketType: "dataSocket",
        },
      ],
    });

    const fewshotControl = new FewshotControl({
      language: "handlebars",
    });

    node.inspector.add(inputGenerator).add(fewshotControl);

    return node.addInput(dataIn).addOutput(dataOut).addOutput(resultOut);
  }

  async worker(node, rawInputs, { element }) {
    const inputs = Object.entries(rawInputs).reduce((acc, [key, value]) => {
      acc[key] = value[0];
      return acc;
    }, {});

    const template = Handlebars.compile(node.data.fewshot);
    const prompt = template(inputs);

    const body = {
      prompt,
      stop: ["\n"],
      maxTokens: 100,
      temperature: 0.0,
    };
    const raw = await completion(body);
    const result = raw.trim();

    return {
      result,
    };
  }
}
