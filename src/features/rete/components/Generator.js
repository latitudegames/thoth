import Rete from "rete";
import Handlebars from "handlebars";
import { dataSocket, stringSocket } from "../sockets";
import { InputGeneratorControl } from "../dataControls/InputGenerator";
import { InputControl } from "../dataControls/InputControl";
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

    const stopControl = new InputControl({
      dataKey: "stop",
      name: "Stop",
    });

    const temperatureControl = new InputControl({
      dataKey: "temp",
      name: "Temperature",
    });

    const maxTokenControl = new InputControl({
      dataKey: "maxTokens",
      name: "Max Tokens",
    });

    node.inspector
      .add(inputGenerator)
      .add(fewshotControl)
      .add(stopControl)
      .add(temperatureControl)
      .add(maxTokenControl);

    return node.addInput(dataIn).addOutput(dataOut).addOutput(resultOut);
  }

  async worker(node, rawInputs, { element }) {
    const inputs = Object.entries(rawInputs).reduce((acc, [key, value]) => {
      acc[key] = value[0];
      return acc;
    }, {});

    const template = Handlebars.compile(node.data.fewshot);
    const prompt = template(inputs);

    const stop = node?.data?.stop
      ? node.data.stop.split(",").map((i) => i.trim())
      : ["/n"];

    const temperature = node?.data?.temp ? parseFloat(node.data.temp) : 0.0;
    const maxTokens = node?.data?.maxTokens
      ? parseFloat(node.data.maxTokens)
      : 0.0;

    const body = {
      prompt,
      stop,
      maxTokens,
      temperature,
    };
    const raw = await completion(body);

    console.log("RAW", raw);

    const result = raw.trim();

    return {
      result,
    };
  }
}
