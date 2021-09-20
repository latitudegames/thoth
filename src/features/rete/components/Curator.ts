import Rete from "rete";
import { ThothReteComponent } from "./ThothReteComponent";
import { arraySocket, triggerSocket, booleanSocket } from "../sockets";

const info = `The forEach component takes in an array, and will iterate over each item in the array, firing a new trigger signal with the appropriate value,until all items in the array have beeb processed.`;

export class Curator extends ThothReteComponent {
  constructor() {
    super("Curator");
    this.task = {
      outputs: { verdict: "output", trigger: "option" },
      init: (task) => {},
    };
    this.category = "AI/ML";
    this.info = info;
  }

  builder(node) {
    var inp0 = new Rete.Input("array", "Array", arraySocket);
    var inp1 = new Rete.Input("trigger", "Trigger", triggerSocket);
    var out0 = new Rete.Output("verdict", "Verdict", booleanSocket);
    var out1 = new Rete.Output("trigger", "Trigger", triggerSocket);
    var out2 = new Rete.Output("mask", "Mask", arraySocket);

    return node
      .addInput(inp0)
      .addInput(inp1)
      .addOutput(out0)
      .addOutput(out1)
      .addOutput(out2)
  }

  async worker(node, inputs, outputs, { element }) {
  }
}
