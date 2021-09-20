import Rete from "rete";
import { ThothReteComponent } from "./ThothReteComponent";
import { numSocket, triggerSocket, booleanSocket } from "../sockets";
import { InputControl } from "../dataControls/InputControl";


const info = `Returns true if prob exceeds threshold`;

export class ProbThreshold extends ThothReteComponent {
  constructor() {
    // Name of the component
    super("ProbThreshold");

    this.task = {
      outputs: {
        meetsThreshold: "output",
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
    const probInput = new Rete.Input("prob", "Prob", numSocket);
    const dataInput = new Rete.Input("trigger", "Trigger", triggerSocket);
    const dataOutput = new Rete.Output("trigger", "Trigger", triggerSocket);
    const out = new Rete.Output("meetsThreshold", "MeetsThreshold", booleanSocket);

    node
      .addInput(probInput)
      .addInput(dataInput)
      .addOutput(out)
      .addOutput(dataOutput);

    const thresholdControl = new InputControl({
      dataKey: "threshold",
      name: "Threshold",
    });

    node.inspector
      .add(thresholdControl);

    return node;
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  async worker(node, inputs, outputs) {
    const threshold = parseFloat(node.data.threshold);
    const prob = inputs.prob[0]
    const meetsThreshold = prob > threshold;
    return {
      meetsThreshold: meetsThreshold,
    };
  }
}

