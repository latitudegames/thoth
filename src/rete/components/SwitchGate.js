import Rete from "rete";
import { anySocket, dataSocket } from "../sockets";
import { OutputGenerator } from "../controls/OutputGenerator";

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

  procesOutput;

  // We might need this issue when we want to save and restore the dynamic sockets:
  // https://github.com/retejs/rete/issues/439
  builder(node) {
    this.node = node;

    const setOutputs = (outputs) => {
      this.dynamicOutputs = outputs;

      const existingOutputs = [];

      this.node.outputs.forEach((out) => {
        existingOutputs.push(out.key);
      });

      // Any outputs existing on the current node that arent incoming have been deleted
      // and need to be removed.
      existingOutputs
        .filter((out) => !outputs.includes(out))
        .forEach((key) => {
          const output = this.node.outputs.get(key);
          node.removeOutput(output);
        });

      // any incoming outputs not already on the node are new and will be added.
      const newOutputs = outputs.filter(
        (out) => !existingOutputs.includes(out)
      );

      this.task.outputs = this.dynamicOutputs.reduce((acc, out) => {
        acc[out] = "option";
        return acc;
      }, {});

      newOutputs.forEach((output) => {
        const newOutput = new Rete.Output(
          output,
          capitalizeFirstLetter(output),
          dataSocket
        );
        this.node.addOutput(newOutput);
      });

      node.update();
      this.editor.trigger("process");
    };

    const switchControl = new OutputGenerator({
      setOutputs: (outputs) => setOutputs.call(this, outputs),
      key: "dynamicOutput",
    });

    const input = new Rete.Input("input", "Input", anySocket);
    const dataInput = new Rete.Input("data", "Data", dataSocket);
    const defaultOutput = new Rete.Input("default", "Default", dataSocket);

    node
      .addInput(input)
      .addInput(dataInput)
      .addOutput(defaultOutput)
      .addControl(switchControl);

    return node;
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connecte components
  async worker(node, inputs, data) {
    const input = inputs["input"][0];
    console.log("SWITCH WORKER", input);

    // close all outputs
    this._task.closed = [...this.dynamicOutputs];

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
