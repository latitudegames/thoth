import Rete from "rete";
import * as sockets from "../sockets";

import { DataControl } from "../plugins/inspectorPlugin";

export class InputGeneratorControl extends DataControl {
  constructor({
    defaultOutputs = [],
    socketType = "anySocket",
    taskType = "output",
    ignored = [],
  }) {
    const options = {
      dataKey: "inputs",
      name: "Data Inputs",
      controls: {
        component: "inputGenerator",
        data: {
          ignored,
          socketType,
          taskType,
        },
      },
    };

    super(options);
  }

  onData(inputs) {
    if (!inputs) return;

    this.node.data.inputs = inputs;

    const existingInputs = [];

    this.node.inputs.forEach((out) => {
      existingInputs.push(out.key);
    });

    // Any inputs existing on the current node that arent incoming have been deleted
    // and need to be removed.
    existingInputs
      .filter(
        (existing) => !inputs.some((incoming) => incoming.name === existing)
      )
      .forEach((key) => {
        const output = this.node.inputs.get(key);

        this.node
          .getConnections()
          .filter((con) => con.input.key === key)
          .forEach((con) => {
            this.editor.removeConnection(con);
          });

        this.node.removeInput(output);
      });

    // any incoming inputs not already on the node are new and will be added.
    const newInputs = inputs.filter(
      (input) => !existingInputs.includes(input.name)
    );

    // From these new inputs, we iterate and add an output socket to the node
    newInputs.forEach((output) => {
      const newInput = new Rete.Input(
        output.name.toLowerCase(),
        output.name,
        sockets[output.socketType]
      );
      this.node.addInput(newInput);
    });

    this.node.update();
  }
}
