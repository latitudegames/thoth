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

  // TODO refactor this function into smaller class functions
  // note: might be possible to abstract this into a parent class to be used by anyone
  // that wants to make components with dynamic outputs.
  builder(node) {
    this.node = node;

    const setOutputs = (outputs) => {
      this.dynamicOutputs = outputs;

      // save these to the nodes data
      this.node.data.outputs = outputs;

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

      // Here we are running over and ensuring that the outputs are in the task
      this.task.outputs = this.dynamicOutputs.reduce((acc, out) => {
        acc[out] = "option";
        return acc;
      }, {});

      // From these new outputs, we iterate and add an output socket to the node
      newOutputs.forEach((output) => {
        const newOutput = new Rete.Output(
          output,
          capitalizeFirstLetter(output),
          dataSocket
        );
        this.node.addOutput(newOutput);
      });

      // Update the node so these changes take effect
      console.log("RUNNING NODE UPDATE");
      node.update();
    };

    const switchControl = new OutputGenerator({
      defaultOutputs: node.data.outputs || ["default"],
      setOutputs: (outputs) => setOutputs.call(this, outputs),
      key: "dynamicOutput",
    });

    const input = new Rete.Input("input", "Input", anySocket);
    const dataInput = new Rete.Input("data", "Data", dataSocket);
    const defaultOutput = new Rete.Output("default", "Default", dataSocket);

    node
      .addInput(input)
      .addInput(dataInput)
      .addOutput(defaultOutput)
      .addControl(switchControl);

    // Handle outputs in the nodes data to repopulate when loading from JSON
    if (node.data.outputs && node.data.outputs.length !== 0) {
      console.log("Output data found");
      node.data.outputs.forEach((key) => {
        const output = new Rete.Output(
          key,
          capitalizeFirstLetter(key),
          dataSocket
        );
        node.addOutput(output);
      });

      // Add the data outputs to the tasks outputs
      this.task.outputs = node.data.outputs.reduce(
        (acc, out) => {
          acc[out] = "option";
          return acc;
        },
        { ...this.task.outputs }
      );
    }

    return node;
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
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
