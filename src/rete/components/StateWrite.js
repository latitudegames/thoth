import Rete from "rete";
import { anySocket, dataSocket } from "../sockets";
import { InputGenerator } from "../controls/InputGenerator";

export class StateWrite extends Rete.Component {
  constructor() {
    // Name of the component
    super("State Write");

    this.task = {
      outputs: {},
    };
  }

  node = {};

  // TODO refactor this function into smaller class functions
  // note: might be possible to abstract this into a parent class to be used by anyone
  // that wants to make components with dynamic outputs.
  builder(node) {
    this.node = node;

    const setInputs = (inputs, ignore) => {
      this.dynamicInputs = inputs;

      this.node.data.inputs = inputs;

      const existingInputs = [];

      this.node.inputs.forEach((input) => {
        existingInputs.push(input.key);
      });

      // Any outputs existing on the current node that arent incoming have been deleted
      // and need to be removed.
      existingInputs
        .filter((input) => !inputs.includes(input))
        .forEach((key) => {
          const input = this.node.inputs.get(key);

          node
            .getConnections()
            .filter((con) => con.input.key === key)
            .forEach((con) => {
              this.editor.removeConnection(con);
            });

          node.removeInput(input);
        });

      // any incoming outputs not already on the node are new and will be added.
      const newInputs = inputs.filter((out) => !existingInputs.includes(out));

      // From these new outputs, we iterate and add an output socket to the node
      newInputs.forEach((input) => {
        const newInput = new Rete.Input(input, input, anySocket);
        this.node.addInput(newInput);
      });

      node.update();
    };

    const inputGenerator = new InputGenerator({
      defaultInputs: node.data.inputs || ["data"],
      ignored: ["data"],
      setInputs: (inputs) => setInputs.call(this, inputs),
      key: "dynamicInput",
    });

    const dataInput = new Rete.Input("data", "Data", dataSocket);

    node.addControl(inputGenerator).addInput(dataInput);

    // Handle outputs in the nodes data to repopulate when loading from JSON
    if (node.data.inputs && node.data.inputs.length !== 0) {
      node.data.inputs.forEach((key) => {
        const input = new Rete.Output(key, key, anySocket);
        node.addInput(input);
      });
    }

    return node;
  }

  async worker(node, inputs, data) {
    const updates = Object.entries(inputs).reduce((acc, [key, val]) => {
      // we are assuming there is only one incoming input and not many here
      acc[key] = val[0];

      return acc;
    }, {});

    await this.editor.thoth.updateCurrentGameState(updates);
  }
}
