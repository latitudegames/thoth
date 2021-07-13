import Rete from "rete";
import { anySocket, dataSocket } from "../sockets";
import { OutputGeneratorControl } from "../dataControls/OutputGenerator";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export class SwitchGate extends Rete.Component {
  constructor() {
    // Name of the component
    super("Switch");

    this.task = {
      outputs: { data: "option" },
    };
  }

  node = {};

  builder(node) {
    const outputGenerator = new OutputGeneratorControl(
      node.data.outputs,
      "dataSocket"
    );
    node.inspector.add(outputGenerator);

    const input = new Rete.Input("input", "Input", anySocket);
    const dataInput = new Rete.Input("data", "Data", dataSocket);

    node.addInput(input).addInput(dataInput);

    return node;
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  async worker(node, inputs, data) {
    const input = inputs["input"][0];

    // close all outputs
    this._task.closed = [...node.data.outputs];

    if (this._task.closed.includes(input)) {
      // If the ouputs closed has the incoming text, filter closed outputs to not include it
      this._task.closed = this._task.closed.filter(
        (output) => output !== input
      );
    } else {
      // otherwise open up the default output
      this._task.closed = this._task.closed.filter(
        (output) => output !== "default"
      );
    }
  }
}
