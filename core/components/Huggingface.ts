import Rete from "rete";
import Handlebars from "handlebars";
import { triggerSocket, stringSocket } from "../sockets";
import { SocketGeneratorControl } from "../dataControls/SocketGenerator";
import { InputControl } from "../dataControls/InputControl";
import { FewshotControl } from "../dataControls/FewshotControl";
import { ThothComponent } from "../thoth-component"
import { NodeData, ThothNode, ThothWorkerInputs, ThothWorkerOutputs } from "../types";
import { EngineContext } from "../engine";
const info = `The huggingface component is used to access models on huggingface.co.  For now it is very simple.  You define a number of inputs with the input generator, and you can use those in forming the request to your huggingface inference model.  You input the name of the mode from hugginface into the model name field, and you run it.  It will call the model, and return the result.

NOTE:  Hugginface models are on deman, and sometimes require time to "boot up".  We have tried to trigger an initial request the cause the model to load in th ebackground while you and working, but this will not always be done in time. If it is not done, we will notify you via the "error" trigger out.

Also note that you will likely need to parse the return from huggingfacwe yourself inside a code component, or similar.`;

export class HuggingfaceComponent extends ThothComponent {
  constructor() {
    super("Huggingface");
    this.task = {
      outputs: {
        result: "output",
        trigger: "option",
        error: "option",
      },
    };
    this.category = "AI/ML";
    this.info = info;
  }

  builder(node: ThothNode) {
    const triggerIn = new Rete.Input("trigger", "Trigger", triggerSocket);
    const triggerOut = new Rete.Output("trigger", "Trigger", triggerSocket);
    const errorOut = new Rete.Output("error", "Error", triggerSocket);
    const resultOut = new Rete.Output("result", "Result", stringSocket);

    node
      .addInput(triggerIn)
      .addOutput(triggerOut)
      .addOutput(resultOut)
      .addOutput(errorOut);

    const nameControl = new InputControl({
      dataKey: "name",
      name: "Component Name",
    });

    const inputGenerator = new SocketGeneratorControl({
      connectionType: "input",
      name: "Input Sockets",
      ignored: ["trigger"],
    });

    const requestControl = new FewshotControl({
      dataKey: "request",
      name: "Request",
      language: "handlebars",
    });

    const stopControl = new InputControl({
      dataKey: "modelName",
      name: "Model Name",
    });

    node.inspector
      .add(nameControl)
      .add(inputGenerator)
      .add(requestControl)
      .add(stopControl);

    return node;
  }

  async worker(node: NodeData, rawInputs: ThothWorkerInputs, outputs: ThothWorkerOutputs, { thoth }: { silent: boolean, thoth: EngineContext }) {
    this._task.closed = ["error"];

    const inputs = Object.entries(rawInputs).reduce((acc, [key, value]) => {
      acc[key] = value[0];
      return acc;
    }, {} as Record<string, unknown>);

    const string = node.data.request || "";
    const template = Handlebars.compile(string);
    const request = template(inputs);
    const model = node.data.model as string || "roberta-large-mnli";

    try {
      const result = await thoth.huggingface(model, request);

      if (result.error) throw Error();
      console.log("huggingface result", result);

      return {
        result,
      };
    } catch (err) {
      console.log("err", err);
      this._task.closed = ["trigger"];

      return {};
    }
  }
}
