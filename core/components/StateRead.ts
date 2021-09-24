import { ThothComponent } from "../thoth-component"
import { SocketGeneratorControl } from "../dataControls/SocketGenerator";
import { NodeData, ThothNode, ThothWorkerInputs, ThothWorkerOutputs } from "../types";
import { EngineContext } from "../engine";
const info = `The State Read component allows you to read values from the state.  These can be found in and are managed by the State Manager window.  This window consists of a JSON object.  You can define any number ouf outputs where an outputs name corresponds to a key in the state manager.  Whatever value is assigned to that key will be read ans passed into your chain.`;
export class StateRead extends ThothComponent {
  constructor() {
    // Name of the component
    super("State Read");

    this.task = {
      outputs: {},

    };
    this.category = "State";
    this.info = info;
  }

  builder(node: ThothNode) {
    const outputGenerator = new SocketGeneratorControl({
      connectionType: "output",
      name: "Output sockets",
    });

    node.inspector.add(outputGenerator);

    return node;
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  async worker(node: NodeData, inputs: ThothWorkerInputs, outputs: ThothWorkerOutputs, { silent, thoth }: { silent: boolean, thoth: EngineContext }) {
    const { getCurrentGameState } = thoth
    const gameState = await getCurrentGameState();

    return Object.entries(gameState).reduce((acc, [key, value]) => {

      const nodeOutputs = node.data.outputs as { name: string, [key: string]: unknown }[]
      if (nodeOutputs.some((out) => out.name === key)) {
        acc[key] = value;
      }

      return acc;
    }, {} as { [key: string]: unknown });
  }
}
