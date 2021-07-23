import Rete from "rete";
import { anySocket, triggerSocket } from "../sockets";
import { SocketGeneratorControl } from "../dataControls/SocketGenerator";

// function capitalizeFirstLetter(string) {
//   return string.charAt(0).toUpperCase() + string.slice(1);
// }

export class SwitchGate extends Rete.Component {
  constructor() {
    // Name of the component
    super("Switch");

    this.task = {
      outputs: { trigger: "option" },
    };
    this.category = "Logic";
  }

  node = {};

  builder(node) {
    const outputGenerator = new SocketGeneratorControl({
      connectionType: "output",
      socketType: "triggerSocket",
      taskType: "option",
      name: "Output Sockets",
    });

    node.inspector.add(outputGenerator);

    const input = new Rete.Input("input", "Input", anySocket);
    const dataInput = new Rete.Input("trigger", "Trigger", triggerSocket);

    node.addInput(input).addInput(dataInput);

    return node;
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  async worker(node, inputs, data) {
    const input = inputs["input"][0];

    // close all outputs
    // this._task.closed = node.data.outputs.map((out) => out.name);

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
