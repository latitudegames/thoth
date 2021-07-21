import Rete from "rete";
import { dataSocket } from "../sockets";
import { CodeControl } from "../dataControls/CodeControl";
import { InputControl } from "../dataControls/InputControl";
import { OutputGeneratorControl } from "../dataControls/OutputGenerator";
import { InputGeneratorControl } from "../dataControls/InputGenerator";

export class Code extends Rete.Component {
  constructor() {
    // Name of the component
    super("Code");

    this.task = {
      outputs: {
        data: "option",
      },
    };
  }

  builder(node) {
    const outputGenerator = new OutputGeneratorControl({
      ignored: [
        {
          name: "data",
          socketType: "dataSocket",
        },
      ],
    });

    const inputGenerator = new InputGeneratorControl({
      ignored: [
        {
          name: "data",
          socketType: "dataSocket",
        },
      ],
    });

    const codeControl = new CodeControl({
      dataKey: "code",
      name: "Code",
    });

    const nameControl = new InputControl({
      dataKey: "name",
      name: "Component Name",
    });

    node.inspector
      .add(nameControl)
      .add(outputGenerator)
      .add(inputGenerator)
      .add(codeControl);

    const dataInput = new Rete.Input("data", "Data", dataSocket);
    const dataOutput = new Rete.Output("data", "Data", dataSocket);

    node.addOutput(dataOutput).addInput(dataInput);
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  async worker(node, inputs, data) {
    function runCodeWithArguments(obj) {
      // eslint-disable-next-line no-new-func
      return Function('"use strict";return (' + obj + ")")()(
        node,
        inputs,
        data
      );
    }

    try {
      const value = runCodeWithArguments(node.data.code);
      console.log("run value", value);

      return value;
    } catch (err) {
      console.log("Error evaluating code", err);
    }
  }
}
