import Rete from "rete";

export class StateRead extends Rete.Component {
  constructor() {
    // Name of the component
    super("State sRead");

    this.task = {
      outputs: {},
    };
  }
  builder(node) {
    return node;
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  async worker(node, inputs, data) {
    return {};
  }
}
