import Rete from "rete";
import { stringSocket, dataSocket, itemTypeSocket } from "../sockets";
import { DisplayControl } from "../controls/DisplayControl";
import { completion } from "../../../utils/openaiHelper";

// For simplicity quests should be ONE thing not complete X and Y
const fewShots = `Given an action, detect the item which is taken.

Action, Item: pick up the goblet from the fountain, goblet
Action, Item: grab the axe from the tree stump, axe
Action, Item: lean down and grab the spear from the ground, spear
Action, Item: gather the valerian plant from the forest, valerian plant
Action, Item: get the necklace from the box, necklace
Action, Item: `;

export class ItemTypeComponent extends Rete.Component {
  constructor() {
    // Name of the component
    super("Item Detector");

    this.task = {
      outputs: { detectedItem: "output", data: "option" },
    };
  }

  displayControl = {};

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have grabbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node) {
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const inp = new Rete.Input("string", "Text", stringSocket);
    const out = new Rete.Output(
      "detectedItem",
      "Item Detected",
      itemTypeSocket
    );
    const dataInput = new Rete.Input("data", "Data", dataSocket);
    const dataOutput = new Rete.Output("data", "Data", dataSocket);

    // controls are the internals of the node itself
    // This default control sample has a text field.
    const display = new DisplayControl({
      key: "display",
    });

    this.displayControl = display;

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(out)
      .addControl(display);
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  async worker(node, inputs, outputs) {
    const action = inputs["string"][0];
    const prompt = fewShots + action + ",";

    const body = {
      prompt,
      stop: ["\n"],
      maxTokens: 100,
      temperature: 0.0,
    };
    const raw = await completion(body);
    const result = raw.trim();
    this.displayControl.display(result);

    return {
      detectedItem: result,
    };
  }
}
