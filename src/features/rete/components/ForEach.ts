import Rete from "rete";
import { ThothReteComponent } from "./ThothReteComponent";
import { arraySocket, triggerSocket, anySocket } from "../sockets";

const info = `The forEach component takes in an array, and will iterate over each item in the array, firing a new trigger signal with the appropriate value,until all items in the array have beeb processed.`;

export class ForEach extends ThothReteComponent {
  constructor() {
    super("ForEach");
    this.task = {
      outputs: { act: "option", element: "output", done: "option" },
      init: (task) => {},
    };
    this.category = "Logic";
    this.info = info;
  }

  builder(node) {
    var inp0 = new Rete.Input("act1", "Data", triggerSocket, true);
    var inp1 = new Rete.Input("array", "Array", arraySocket);
    var out1 = new Rete.Output("act", "Data", triggerSocket);
    var out2 = new Rete.Output("element", "Item", anySocket);
    var out3 = new Rete.Output("done", "Done", triggerSocket);

    return node
      .addInput(inp0)
      .addInput(inp1)
      .addOutput(out1)
      .addOutput(out2)
      .addOutput(out3);
  }

  async worker(node, inputs, outputs) {
    if (outputs.element === undefined) {
      await Promise.all(
        inputs.array[0].map((el) => this._task.clone(false, null, null).run({ element: el }))
      );
      this._task.closed = ["act"];
    } else {
      this._task.closed = ["done"];
      return { element: outputs.element };
    }
  }
}
