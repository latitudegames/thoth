import Rete from "rete";
import { triggerSocket } from "../sockets";
import { SocketGeneratorControl } from "../dataControls/SocketGenerator";
import { ThothComponent } from "../thoth-component";

const info = `The State Write component allows you to define any number of inputs, and to write values to the state manager which correspond to the namesof thise inputs.  If the value does not exist in the state, it willbe written.

Note here that there are a few assumptions made, which will be changed once we have selectable socket types when generating inputs. If the key already exists in the state and it is an array, whatever value you insert will be added to the array. If the existing value is an object, the object will be updated by the incoming value.`;

export class StateWrite extends ThothComponent {
  constructor() {
    // Name of the component
    super("State Write");

    this.task = {
      outputs: {},

    };

    this.category = "State";
    this.info = info;
  }

  builder(node) {
    const dataInput = new Rete.Input("trigger", "Trigger", triggerSocket);

    const inputGenerator = new SocketGeneratorControl({
      connectionType: "input",
      ignored: ["trigger"],
      name: "Input Sockets",
    });

    node.inspector.add(inputGenerator);
    node.addInput(dataInput);

    return node;
  }

  async worker(node, inputs, outputs, { silent, thoth }) {

    const { getCurrentGameState, updateCurrentGameState } = thoth
    const gameState = await getCurrentGameState();
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

    await updateCurrentGameState(updates);
  }
}
