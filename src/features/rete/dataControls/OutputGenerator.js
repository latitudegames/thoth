import Rete from "rete";
import * as sockets from "../sockets";

import { DataControl } from "../plugins/inspectorPlugin";

export class OutputGeneratorControl extends DataControl {
  constructor(defaultOutputs = [], socketType = "anySocket") {
    const options = {
      dataKey: "outputs",
      name: "Data Outputs",
      controls: {
        component: "outputGenerator",
        data: {
          socketType: socketType,
        },
      },
    };

    super(options);
    this.socketType = socketType;
  }

  onData(outputs = []) {
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

        this.node
          .getConnections()
          .filter((con) => con.output.key === key)
          .forEach((con) => {
            this.editor.removeConnection(con);
          });

        this.node.removeOutput(output);
      });

    // any incoming outputs not already on the node are new and will be added.
    const newOutputs = outputs.filter((out) => !existingOutputs.includes(out));

    // Here we are running over and ensuring that the outputs are in the task
    this.component.task.outputs = this.node.data.outputs.reduce(
      (acc, out) => {
        acc[out] = "output";
        return acc;
      },
      { ...this.component.task.outputs }
    );

    // From these new outputs, we iterate and add an output socket to the node
    console.log("Constrution socket type", this.socketType);
    newOutputs.forEach((output) => {
      const newOutput = new Rete.Output(
        output,
        output,
        sockets[this.socketType]
      );
      this.node.addOutput(newOutput);
    });

    console.log("node data", this.node.data);

    this.node.update();
  }
}
