import Rete from "rete";
import { ThothReteComponent } from "./ThothReteComponent";
import { arraySocket, triggerSocket, objectSocket } from "../sockets";

const info = `Extracts logprobs from model response object. Returns a list of logprob objects for each token position.`;

export class Logprobs extends ThothReteComponent {
  constructor() {
    // Name of the component
    super("Logprobs");

    this.task = {
      outputs: {
        logprobs: "output",
        trigger: "option",
      },
      init: (task) => {},
    };

    this.category = "AI/ML";
    this.display = true;
    this.info = info;
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have grabbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node) {
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const modelInput = new Rete.Input("response", "Response", objectSocket);
    const dataInput = new Rete.Input("trigger", "Trigger", triggerSocket);
    const dataOutput = new Rete.Output("trigger", "Trigger", triggerSocket);
    const out = new Rete.Output("logprobs", "Logprobs", arraySocket);

    return node
      .addInput(modelInput)
      .addInput(dataInput)
      .addOutput(out)
      .addOutput(dataOutput);
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  async worker(node, inputs, outputs) {
    const logprobs = inputs.response['0'].choices[0].logprobs.top_logprobs;
    return {
      logprobs: logprobs,
    };
  }
}

