import Rete from "rete";
import { ThothReteComponent } from "./ThothReteComponent";
import { numSocket, triggerSocket } from "../sockets";

const info = `Converts a logprob into a probability`;

export class LogprobToProb extends ThothReteComponent {
  constructor() {
    // Name of the component
    super("LogprobToProb");

    this.task = {
      outputs: {
        prob: "output",
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
    const logprobInput = new Rete.Input("logprob", "Logprob", numSocket);
    const dataInput = new Rete.Input("trigger", "Trigger", triggerSocket);
    const dataOutput = new Rete.Output("trigger", "Trigger", triggerSocket);
    const out = new Rete.Output("prob", "Prob", numSocket);

    return node
      .addInput(logprobInput)
      .addInput(dataInput)
      .addOutput(out)
      .addOutput(dataOutput);

  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  async worker(node, inputs, outputs) {
    const logprob = inputs.logprob[0]
    const prob = Math.exp(logprob)
    return {
      prob: prob,
    };
  }
}

