import Rete from "rete";
import { anySocket, triggerSocket } from "../sockets";
import { SocketGeneratorControl } from "../dataControls/SocketGenerator";
import { ThothComponent } from "../thoth-component"
import { ThothNode, ThothWorkerInputs } from "../types";
// function capitalizeFirstLetter(string) {
//   return string.charAt(0).toUpperCase() + string.slice(1);
// }

const info = `The Switch Gate component takes a single input, and allows you to define any number of outputs.  Its works the same as the javascript switch.  The component will try to match the value of the input to one of the output socketnames you have created.  It will route the trigger signal through that socket.`;

export class SwitchGate extends ThothComponent {
  constructor() {
    // Name of the component
    super("Switch");

    this.task = {
      outputs: { default: "option" },
      init: (task) => { },
    };
    this.category = "Logic";
    this.info = info;
  }

  node = {};

  builder(node: ThothNode) {
    const outputGenerator = new SocketGeneratorControl({
      connectionType: "output",
      ignored: ["default"],
      socketType: "triggerSocket",
      taskType: "option",
      name: "Output Sockets",
    });

    node.inspector.add(outputGenerator);

    const input = new Rete.Input("input", "Input", anySocket);
    const dataInput = new Rete.Input("trigger", "Trigger", triggerSocket);
    const defaultOutput = new Rete.Output("default", "Default", triggerSocket);

    node.addInput(input).addInput(dataInput).addOutput(defaultOutput);

    return node;
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  async worker(node: ThothNode, inputs: ThothWorkerInputs) {
    const input = inputs["input"][0] as string;

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
