import Rete from "rete";
import { ThothReteComponent } from "./ThothReteComponent";
import { numSocket, triggerSocket, objectSocket } from "../sockets";
import { InputControl } from "../dataControls/InputControl";


const info = `Extracts the logprob of a particular token from a logprob objects`;

export class LogprobOf extends ThothReteComponent {
  constructor() {
    // Name of the component
    super("LogprobOf");

    this.task = {
      outputs: {
        logprob: "output",
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
    const logprobInput = new Rete.Input("logprobs", "Logprobs", objectSocket);
    const dataInput = new Rete.Input("trigger", "Trigger", triggerSocket);
    const dataOutput = new Rete.Output("trigger", "Trigger", triggerSocket);
    const out = new Rete.Output("logprob", "Logprob", numSocket);

    node
      .addInput(logprobInput)
      .addInput(dataInput)
      .addOutput(out)
      .addOutput(dataOutput);

    const tokenControl = new InputControl({
      dataKey: "token",
      name: "Token",
    });

    node.inspector
      .add(tokenControl);

    return node;
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  async worker(node, inputs, outputs) {
    //console.log('inputs', inputs)
    const token = node.data.token.toString();
    const logprob = inputs.logprobs[0][token];
    return {
      logprob: logprob,
    };
  }
}

