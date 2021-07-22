import Rete from "rete";
import { dataSocket } from "../sockets";
import { InputGeneratorControl } from "../dataControls/InputGenerator";

export class StateWrite extends Rete.Component {
  constructor() {
    // Name of the component
    super("State Write");

    this.task = {
      outputs: {},
    };

    this.category = "State"
  }

  builder(node) {
    const dataInput = new Rete.Input("data", "Data", dataSocket);

    const inputGenerator = new InputGeneratorControl({
      ignored: [
        {
          name: "data",
          socketType: "dataSocket",
        },
      ],
    });

    node.inspector.add(inputGenerator);
    node.addInput(dataInput);

    return node;
  }

  async worker(node, inputs, data) {
    const gameState = await this.editor.thoth.getCurrentGameState();
    let value;

    const updates = Object.entries(inputs).reduce((acc, [key, val]) => {
      // Check here what type of data structure the gameState for the key is
      switch (typeof gameState[key]) {
        case "object":
          // if we have an array, add the value to the array and reassign to the state
          if (Array.isArray(gameState[key])) {
            value = [...gameState[key], val[0]];
            break;
          }

          // if it is an object, we assume that the incoming data is an object update
          value = { ...gameState[key], ...val[0] };

          break;
        default:
          // default is to just overwrite whatever value is there with a new one.
          value = val[0];
      }

      acc[key] = value;

      return acc;
    }, {});

    await this.editor.thoth.updateCurrentGameState(updates);
  }
}
