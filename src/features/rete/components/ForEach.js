import Rete from "rete";
import { arraySocket, dataSocket, anySocket } from "../sockets";

export class ForEach extends Rete.Component {
  constructor() {
    super("ForEach");
    this.task = {
      outputs: { act: "option", element: "output", done: "option" },
    };
    this.category = "Logic"
  }

  builder(node) {
    var inp0 = new Rete.Input("act1", "Data", dataSocket, true);
    var inp1 = new Rete.Input("array", "Array", arraySocket);
    var out1 = new Rete.Output("act", "Data", dataSocket);
    var out2 = new Rete.Output("element", "Item", anySocket);
    var out3 = new Rete.Output("done", "Done", dataSocket);

    return node
      .addInput(inp0)
      .addInput(inp1)
      .addOutput(out1)
      .addOutput(out2)
      .addOutput(out3);
  }

  async worker(node, inputs, { element }) {
    if (element === undefined) {
      await Promise.all(
        inputs.array[0].map((el) => this._task.clone().run({ element: el }))
      );
      this._task.closed = ["act"];
    } else {
      this._task.closed = ["done"];
      return { element };
    }
  }
}
