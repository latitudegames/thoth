import Rete from "rete";
import { anySocket, booleanSocket } from "../sockets";

export class BooleanPassthrough extends Rete.Component {
  constructor() {
    // Name of the component
    super("Boolean Passthrough");

    this.task = {
      outputs: { passthroughOut: "option" },
    };
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have garbbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node) {
    const bool = new Rete.Input("boolean", "Boolean", booleanSocket);
    const passthroughInput = new Rete.Input(
      "passthroughIn",
      "Passthrough",
      anySocket
    );

    const passthroughOutput = new Rete.Output(
      "passthroughOut",
      "Passthrough",
      anySocket
    );

    return node
      .addOutput(passthroughOutput)
      .addInput(passthroughInput)
      .addInput(bool);
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connecte components
  async worker(node, inputs, outputs) {
    const isTrue = inputs["boolean"][0];

    console.log("Is true", isTrue);

    if (!isTrue) {
      console.log("closing");
      this.closed = ["passthroughOut"];
    } else {
      console.log("passing through");
      outputs["passthroughOut"] = inputs["passthroughIn"][0];
    }
  }
}
