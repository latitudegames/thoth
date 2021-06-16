import Rete from "rete";
import { MyControl } from "../controls/Control";
import { stringSocket, actionSocket } from "../sockets";

export class TenseTransformer extends Rete.Component {
  constructor() {
    // Name of the component
    super("Tense Transformer");
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have garbbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node) {
    // create inputs here. First argument is th ename, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const inp = new Rete.Input("text", "String", stringSocket);
    const out = new Rete.Output("action", "Action", actionSocket);

    // controls are the internals of the node itself
    // This default control simple has a text field.
    const ctrl = new MyControl(this.editor, "greeting", "#username");

    return node.addInput(inp).addOutput(out).addControl(ctrl);
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connecte components
  worker(node, inputs, outputs) {
    console.log("node", node);
    console.log("input", inputs);
    console.log("outputs", outputs);
    console.log(node.data.greeting);
  }
}
