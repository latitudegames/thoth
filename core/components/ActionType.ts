import Rete from "rete";
import { stringSocket, triggerSocket } from "../sockets";
import { FewshotControl } from "../dataControls/FewshotControl";
import { ThothComponent } from "../thoth-component"
import { NodeData, ThothNode, ThothWorkerInputs, ThothWorkerOutputs } from "../types";
import { EngineContext } from "../engine";
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

export class ActionTypeComponent extends ThothComponent {
  constructor() {
    // Name of the component
    super("Action Type Classifier");
    this.task = {
      outputs: { actionType: "output", trigger: "option" },
    }
    this.category = "AI/ML";
    this.info = info;
    this.display = true;
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have grabbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node: ThothNode) {
    node.data.fewshot = fewshot;
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const inp = new Rete.Input("action", "Action", stringSocket);
    const out = new Rete.Output("actionType", "ActionType", stringSocket);
    const dataInput = new Rete.Input("trigger", "Trigger", triggerSocket);
    const dataOutput = new Rete.Output("trigger", "Trigger", triggerSocket);

    const fewshotControl = new FewshotControl({});

    node.inspector.add(fewshotControl);

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addOutput(out)
      .addOutput(dataOutput);
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connsected components
  async worker(node: NodeData, inputs: ThothWorkerInputs, outputs: ThothWorkerOutputs, { silent, thoth }: { silent: boolean, thoth: EngineContext }) {
    const { completion } = thoth;
    const action = inputs["action"][0];
    const fewshot = node.data.fewshot as string
    const prompt = fewshot + action + ",";

    const body = {
      prompt,
      stop: ["\n"],
      maxTokens: 100,
      temperature: 0.0,
    };
    const raw = await completion(body) as string;
    const result = raw?.trim();
    if (!silent) node.display(result);

    return {
      actionType: result,
    };
  }
}
