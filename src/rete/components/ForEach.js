import Rete from "rete";
import { arraySocket, dataSocket, anySocket } from "../sockets";

export class ForEach extends Rete.Component {
  constructor() {
    super("ForEach");
    this.task = {
      outputs: { data: "option", item: "output", done: "option" },
    };
  }

  builder(node) {
    var dataInput = new Rete.Input("dataIn", "Data", dataSocket, true);
    var arrayInput = new Rete.Input("array", "Array", arraySocket);
    var dataOut = new Rete.Output("dataOut", "Data", dataSocket);
    var itemout = new Rete.Output("item", "Item", anySocket);
    var doneOut = new Rete.Output("done", "Done", dataSocket);

    return node
      .addInput(dataInput)
      .addInput(arrayInput)
      .addOutput(itemout)
      .addOutput(dataOut)
      .addOutput(doneOut);
  }

  async worker(node, inputs, { item }) {
    if (item === undefined) {
      await Promise.all(
        inputs.array[0].map((item) => this._task.clone().run({ item }))
      );
      this._task.closed = ["dataOut"];
    } else {
      // const sec = Math.random()*1000;
      // await (new Promise((res, rej) => {setTimeout(res, sec)}));
      console.log("ForEach", item);
      this._task.closed = ["done"];
      return { item };
    }
  }
}
