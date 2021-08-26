import Rete from "rete";
import { ThothReteComponent } from "./ThothReteComponent";
import Handlebars from "handlebars";
import { triggerSocket, stringSocket } from "../sockets";
import { SocketGeneratorControl } from "../dataControls/SocketGenerator";
import { InputControl } from "../dataControls/InputControl";
import { FewshotControl } from "../dataControls/FewshotControl";
import { completion } from "../utils/openaiHelper";

const info = `The generator component is our general purpose completion component.  You can define any number of inputs, and utilise those inputs in a templating language known as Handlebars.  Any value which is wrapped like {{this}} in double braces will be replaced with the corresponding value coming in to the input with the same name.  This allows you to write almost any fewshot you might need, and input values from anywhere else in your chain.

Controls have also been added which give you control of some of the fundamental settings of the OpenAI completion endpoint, including temperature, max tokens, and your stop sequence.

The componet has two returns.  The composed will output your entire fewshot plus the completion, whereas the result output will only be the result of the completion. `;

export class Generator extends ThothReteComponent {
  constructor() {
    super("Generator");
    this.task = {
      outputs: {
        result: "output",
        composed: "output",
        trigger: "option",
      },
      init: (task) => {},
    };
    this.category = "AI/ML";
    this.info = info;
  }

  builder(node) {
    const dataIn = new Rete.Input("trigger", "Trigger", triggerSocket);
    const dataOut = new Rete.Output("trigger", "Trigger", triggerSocket);
    const resultOut = new Rete.Output("result", "Result", stringSocket);
    const composedOut = new Rete.Output("composed", "Composed", stringSocket);

    node
      .addInput(dataIn)
      .addOutput(dataOut)
      .addOutput(resultOut)
      .addOutput(composedOut);

    const inputGenerator = new SocketGeneratorControl({
      connectionType: "input",
      name: "Input Sockets",
      ignored: ["trigger"],
    });

    const fewshotControl = new FewshotControl({
      language: "handlebars",
    });

    const stopControl = new InputControl({
      dataKey: "stop",
      name: "Stop",
      icon: "stop-sign",
    });

    const temperatureControl = new InputControl({
      dataKey: "temp",
      name: "Temperature",
      icon: "temperature",
    });

    const maxTokenControl = new InputControl({
      dataKey: "maxTokens",
      name: "Max Tokens",
      icon: "moon",
    });

    node.inspector
      .add(inputGenerator)
      .add(fewshotControl)
      .add(stopControl)
      .add(temperatureControl)
      .add(maxTokenControl);

    return node;
  }

  async worker(node, rawInputs, outputs) {
    const stringInputs = rawInputs as {[key: string]: string[]}
    const inputs = Object.entries(stringInputs).reduce((acc, [key, value]) => {
      acc[key] = value[0];
      return acc;
    }, {});

    const string = node.data.fewshot || "";

    const template = Handlebars.compile(string);
    const prompt = template(inputs);

    const stop = node?.data?.stop
      ? node.data.stop.split(",").map((i) => i.trim())
      : ["/n"];

    const temperature = node?.data?.temp ? parseFloat(node.data.temp) : 0.7;
    const maxTokens = node?.data?.maxTokens
      ? parseInt(node.data.maxTokens)
      : 50;

    const body = {
      prompt,
      stop,
      maxTokens,
      temperature,
    };
    const raw = await completion(body);
    const result = raw?.trim();

    const composed = `${prompt} ${result}`;

    return {
      result,
      composed,
    };
  }
}
