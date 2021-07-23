import Rete from "rete";
import { stringSocket, triggerSocket } from "../sockets";
import { FewshotControl } from "../dataControls/FewshotControl";
import { DisplayControl } from "../controls/DisplayControl";
import { completion } from "../../../utils/openaiHelper";

const fewshot = `Given an action classify the type of action it is

Types: look, get, use, craft, dialog, movement, travel, combat, consume, other

Action, Type: pick up the bucket, get
Action, Type: cast a fireball spell on the goblin, combat
Action, Type: convince the king to give you his kingdom, dialog
Action, Type: talk to the merchant, dialog
Action, Type: leap over the chasm, movement
Action, Type: climb up the mountain, travel
Action, Type: throw a stone at the goblin, combat
Action, Type: run away from the orcs, movement
Action, Type: ask the baker to give you a free loaf of bread, dialog
Action, Type: go to the forest, travel
Action, Type: grab a torch off the wall, get
Action, Type: throw your sword at the table, use
Action, Type: journey to the city, travel
Action, Type: drink your potion, use
Action, Type: `;

const info = `The Action type component will take in an action as text, and attempt to classify it into a discrete number of categories:

look, get, use, craft, dialog, movement, travel, combat, consume, other.`;

export class ActionTypeComponent extends Rete.Component {
  constructor() {
    // Name of the component
    super("Action Type Classifier");
    this.task = {
      outputs: { actionType: "output", trigger: "option" },
    };
    this.category = "AI/ML";
    this.info = info;
  }

  displayControl = {};

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have grabbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node) {
    node.data.fewshot = fewshot;
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const inp = new Rete.Input("action", "Action", stringSocket);
    const out = new Rete.Output("actionType", "ActionType", stringSocket);
    const dataInput = new Rete.Input("trigger", "Trigger", triggerSocket);
    const dataOutput = new Rete.Output("trigger", "Trigger", triggerSocket);

    // controls are the internals of the node itself
    // This default control sample has a text field.
    const display = new DisplayControl({
      key: "display",
    });

    const fewshotControl = new FewshotControl();

    node.inspector.add(fewshotControl);

    this.displayControl = display;

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addOutput(out)
      .addOutput(dataOutput)
      .addControl(display);
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connsected components
  async worker(node, inputs, outputs) {
    const action = inputs["action"][0];
    const prompt = node.data.fewshot + action + ",";

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
      actionType: result,
    };
  }
}
