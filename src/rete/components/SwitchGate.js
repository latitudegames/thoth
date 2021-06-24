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
    const input = new Rete.Input("input", "Input", anySocket);
    const dataInput = new Rete.Input("data", "Data", dataSocket);

    const setOutputs = (outputs) => {
      this.dynamicOutputs = [...outputs, "default"];

      // remove all outputs before adding them back in
      // prevent registered key clash error in rete
      this.node.outputs.forEach((output) => {
        node.removeOutput(output);
      });

      this.task.outputs = this.dynamicOutputs;

      outputs.forEach((output) => {
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

    node.addInput(input).addInput(dataInput).addControl(switchControl);

    return node;
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connecte components
  async worker(node, inputs, data) {
    const input = inputs["input"][0];
    console.log("SWITCH WORKER", input);

    this.task.closed = [...this.dynamicOutputs];

    if (this.closed.includes(input)) {
      this.task.closed = this.closed.filter((output) => output !== input);
    } else {
      this.task.closed = this.closed.filter((output) => output !== "default");
    }
  }
}
