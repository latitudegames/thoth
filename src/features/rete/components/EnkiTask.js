import Rete from "rete";

export class EnkiTask extends Rete.Component {
  constructor() {
    // Name of the component
    super("Enki Task");

    this.task = {
      outputs: { data: "option" },
    };
  }

  displayControl = {};

  builder(node) {
    return node;
  }

  async worker(node, inputs, outputs) {
    return {
      taskOutputs: "",
    };
  }
}
