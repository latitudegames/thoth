import Rete from "rete";
import { booleanSocket, dataSocket } from "../sockets";

export class BooleanGate extends Rete.Component {
  constructor() {
    // Name of the component
    super("Boolean Gate");

    this.task = {
      outputs: { true: "option", false: "option" },
    };
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have grabbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node) {
    const bool = new Rete.Input("boolean", "Boolean", booleanSocket);
    const dataInput = new Rete.Input("data", "Data", dataSocket);
    const isTrue = new Rete.Output("true", "True", dataSocket);
    const isFalse = new Rete.Output("false", "False", dataSocket);

    return node
      .addInput(bool)
      .addInput(dataInput)
      .addOutput(isTrue)
      .addOutput(isFalse);
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  async worker(node, inputs, outputs) {
    const isTrue = inputs["boolean"][0];

    if (isTrue) {
      this._task.closed = ["false"];
    } else {
      this._task.closed = ["true"];
    }
  }
}
