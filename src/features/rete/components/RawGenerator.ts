import Rete from "rete";
import { ThothReteComponent } from "./ThothReteComponent";
import Handlebars from "handlebars";
import { triggerSocket, objectSocket } from "../sockets";
import { SocketGeneratorControl } from "../dataControls/SocketGenerator";
import { InputControl } from "../dataControls/InputControl";
import { FewshotControl } from "../dataControls/FewshotControl";
import { fullCompletion } from "../../../utils/openaiHelper";

const info = `The generator component is our general purpose completion component.  You can define any number of inputs, and utilise those inputs in a templating language known as Handlebars.  Any value which is wrapped like {{this}} in double braces will be replaced with the corresponding value coming in to the input with the same name.  This allows you to write almost any fewshot you might need, and input values from anywhere else in your chain.

Controls have also been added which give you control of some of the fundamental settings of the OpenAI completion endpoint, including temperature, max tokens, and your stop sequence.

The componet has two returns.  The composed will output your entire fewshot plus the completion, whereas the result output will only be the result of the completion. `;

export class RawGenerator extends ThothReteComponent {
  constructor() {
    super("RawGenerator");
    this.task = {
      outputs: {
        response: "output",
        trigger: "option",
      },
      init: (task) => {},
    };
    this.category = "AI/ML";
    this.info = info;
  }

  builder(node) {
    const dataIn = new Rete.Input("trigger", "Trigger", triggerSocket, true);
    const dataOut = new Rete.Output("trigger", "Trigger", triggerSocket);
    const responseOut = new Rete.Output("response", "Response", objectSocket);

    node
      .addInput(dataIn)
      .addOutput(dataOut)
      .addOutput(responseOut)

    const nameControl = new InputControl({
      dataKey: "name",
      name: "Component Name",
    });

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

    // const logitControl = new InputControl({
    //   dataKey: "logit",
    //   name: "Logit bias",
    // });

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

    const numCompletions = new InputControl({
      dataKey: "n",
      name: "Number of completions",
    });

    const logProbs = new InputControl({
      dataKey: "logProbs",
      name: "Number of alterate token logprobs",
    });

    node.inspector
      .add(nameControl)
      .add(inputGenerator)
      .add(fewshotControl)
      .add(stopControl)
      .add(temperatureControl)
      .add(maxTokenControl)
      .add(numCompletions)
      .add(logProbs);
      // .add(logitControl);

    return node;
  }

  async worker(node, rawInputs, outputs) {
    const stringInputs = rawInputs as { [key: string]: string[] };
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

    // const logitBias = node?.data?.logit
    //   ? node?.data?.logit
    //   : {};

    const temperature = node?.data?.temp ? parseFloat(node.data.temp) : 0.7;
    const maxTokens = node?.data?.maxTokens
      ? parseInt(node.data.maxTokens)
      : 50;

    const n = node?.data?.n ? parseInt(node.data.n) : 1;
    const logprobs = node?.data?.logProbs ? parseInt(node.data.logProbs) : 0;

    const body = {
      prompt,
      stop,
      maxTokens,
      temperature,
      n,
      logprobs,
      getFullResponse: true,
    };
    const response = await fullCompletion(body);

    return {
      response: response,
    };
  }
}
