import Rete from "rete";
import { anySocket } from "../sockets";
import { OutputGenerator } from "../controls/OutputGenerator";

export class StateRead extends Rete.Component {
  constructor() {
    // Name of the component
    super("State Read");

    this.task = {
      outputs: {},
    };
  }

  node = {};

  // TODO refactor this function into smaller class functions
  // note: might be possible to abstract this into a parent class to be used by anyone
  // that wants to make components with dynamic outputs.
  builder(node) {
    const setOutputs = (outputs) => {
      node.data.outputs = outputs;

      const existingOutputs = [];

      node.outputs.forEach((out) => {
        existingOutputs.push(out.key);
      });

      // Any outputs existing on the current node that arent incoming have been deleted
      // and need to be removed.
      existingOutputs
        .filter((out) => !outputs.includes(out))
        .forEach((key) => {
          const output = node.outputs.get(key);

          node
            .getConnections()
            .filter((con) => con.output.key === key)
            .forEach((con) => {
              this.editor.removeConnection(con);
            });

          node.removeOutput(output);
        });

      // any incoming outputs not already on the node are new and will be added.
      const newOutputs = outputs.filter(
        (out) => !existingOutputs.includes(out)
      );

      // Here we are running over and ensuring that the outputs are in the task
      this.task.outputs = node.data.outputs.reduce(
        (acc, out) => {
          acc[out] = "output";
          return acc;
        },
        { ...this.task.outputs }
      );

      // From these new outputs, we iterate and add an output socket to the node
      newOutputs.forEach((output) => {
        const newOutput = new Rete.Output(output, output, anySocket);
        node.addOutput(newOutput);
      });

      node.update();
    };

    const switchControl = new OutputGenerator({
      defaultOutputs: node.data.outputs || [],
      setOutputs: (outputs) => setOutputs.call(this, outputs),
      key: "dynamicOutput",
    });

    node.addControl(switchControl);

    // Handle outputs in the nodes data to repopulate when loading from JSON
    if (node.data.outputs && node.data.outputs.length !== 0) {
      node.data.outputs.forEach((key) => {
        const output = new Rete.Output(key, key, anySocket);
        node.addOutput(output);
      });
    }

    this.task.outputs = node.data.outputs.reduce(
      (acc, out) => {
        acc[out] = "output";
        return acc;
      },
      { ...this.task.outputs }
    );

    return node;
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  async worker(node, inputs, data) {
    const gameState = await this.editor.thoth.getCurrentGameState();

    return Object.entries(gameState).reduce((acc, [key, value]) => {
      if (node.data.outputs.includes(key)) {
        acc[key] = value;
      }

      return acc;
    }, {});
  }
}
