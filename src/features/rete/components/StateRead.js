import Rete from "rete";
import { OutputGeneratorControl } from "../dataControls/OutputGenerator";
export class StateRead extends Rete.Component {
  constructor() {
    // Name of the component
    super("State Read");

    this.task = {
      outputs: {},
    };
  }

  builder(node) {
    const outputGenerator = new OutputGeneratorControl(node.data.outputs);
    node.inspector.add(outputGenerator);

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
