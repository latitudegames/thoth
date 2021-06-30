import Rete from "rete";

export class StateWrite extends Rete.Component {
  constructor() {
    // Name of the component
    super("State Write");

    this.task = {
      outputs: {},
    };
  }

  node = {};

  builder(node) {
    this.node = node;

    // const setInputs = (inputs) => {
    //   this.dynamicInputs = inputs;
    // };

    return node;
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  async worker(node, inputs, data) {
    return {};
  }
}
