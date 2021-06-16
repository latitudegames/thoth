import Rete from "rete";
import { TextInputControl } from "../controls/TextInputControl";
import { stringSocket } from "../sockets";

export class InputComponent extends Rete.Component {
  constructor() {
    // Name of the component
    super("Input");
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have garbbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node) {
    // create inputs here. First argument is th ename, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const out = new Rete.Output("text", "String", stringSocket);

    // controls are the internals of the node itself
    // This default control simple has a tet field.
    const ctrl = new TextInputControl(this.editor, "text", "Your action here");

    return node.addOutput(out).addControl(ctrl);
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connecte components
  worker(node, inputs, outputs) {
    console.log("DATA", node.data);
    outputs["text"] = node.data.text;
  }
}
