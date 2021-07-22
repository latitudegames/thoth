import Rete from "rete";
import * as sockets from "../sockets";

import { DataControl } from "../plugins/inspectorPlugin";

export class EnkiThroughputControl extends DataControl {
  constructor({
    socketType = "String",
    taskType = "output",
    nodeId,
    icon = "bird",
  }) {
    const options = {
      dataKey: `throughputs-${nodeId}`,
      name: "Enki Task Details",
      icon,
      controls: {
        component: "enkiSelect",
        data: {
          activetask: {},
          socketType,
          taskType,
        },
      },
    };

    super(options);
    this.socketType = socketType;
  }

  onData({ inputs, outputs, activeTask }) {
    // These are already in the node.data from the Inspector running.  It does this for you by default, spacing it on under the output name
    this.node.data.name = activeTask?.taskName || "Enki Task";
    this.node.data.activetask = activeTask;
    this.node.data.inputs = inputs || [];
    this.node.data.outputs = outputs || [];

    const existingInputs = [];
    const existingOutputs = [];

    this.node.inputs.forEach((input) => {
      existingInputs.push(input.key);
    });

    this.node.outputs.forEach((output) => {
      existingOutputs.push(output.key);
    });

    // Any inputs existing on the current node that arent incoming have been deleted
    // and need to be removed.
    existingInputs
      .filter(
        (existing) => !inputs.some((incoming) => incoming.name === existing)
      )
      .forEach((key) => {
        const input = this.node.inputs.get(key);

        this.node
          .getConnections()
          .filter((con) => con.input.key === key)
          .forEach((con) => {
            this.editor.removeConnection(con);
          });

        this.node.removeInput(input);
      });

    // Any outputs existing on the current node that arent incoming have been deleted
    // and need to be removed.
    existingOutputs
      .filter(
        (existing) => !outputs.some((incoming) => incoming.name === existing)
      )
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

    // any incoming inputs not already on the node are new and will be added.
    const newInputs = inputs.filter(
      (input) => !existingInputs.includes(input.name)
    );

    // any incoming outputs not already on the node are new and will be added.
    const newOutputs = outputs.filter(
      (output) => !existingOutputs.includes(output.name)
    );

    // Here we are running over and ensuring that the outputs are in the task
    this.component.task.outputs = this.node.data.outputs.reduce(
      (acc, output) => {
        acc[output.name] = output.taskType || "output";
        return acc;
      },
      { ...this.component.task.outputs }
    );

    // Output-X is being set to an 'option' taskType rather than output
    // From these new inputs, we iterate and add an input socket to the node
    newInputs.forEach((input) => {
      const newInput = new Rete.Input(
        input.name,
        input.name,
        sockets[input.socketType]
      );
      this.node.addInput(newInput);
    });

    // From these new outputs, we iterate and add an output socket to the node
    newOutputs.forEach((output) => {
      const newOutput = new Rete.Output(
        output.name,
        output.name,
        sockets[output.socketType]
      );
      this.node.addOutput(newOutput);
    });
    this.node.update();
  }
}
