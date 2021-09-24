import Rete from "rete";
import { stringSocket, triggerSocket } from "../sockets";
import { FewshotControl } from "../dataControls/FewshotControl";
import { ThothComponent } from "../thoth-component"
import { NodeData, ThothNode, ThothWorkerInputs, ThothWorkerOutputs } from "../types";
import { EngineContext } from "../engine";
// For simplicity quests should be ONE thing not complete X and Y
const fewshot = `Given an action, predict how long it would take to complete out of the following categories: seconds, minutes, hours, days, weeks, years.

Action, Time: pick up the bucket, seconds
Action, Time: cast a fireball spell on the goblin, seconds
Action, Time: convince the king to give you his kingdom, minutes
Action, Time: talk to the merchant, minutes
Action, Time: leap over the chasm, seconds
Action, Time: climb up the mountain, days
Action, Time: throw a stone at the goblin, seconds
Action, Time: run away from the orcs, minutes
Action, Time: ask the baker to give you a free loaf of bread, seconds
Action, Time: grab a torch off the wall, seconds
Action, Time: throw your sword at the table, seconds
Action, Time: drink your potion, seconds
Action, Time: run away to Worgen, days
Action, Time: travel to the forest, days
Action, Time: go to the city of Braxos, days
Action, Time: sail across the ocean, weeks
Action, Time: take over the kingdom, years
Action, Time: `;

const info = `The Time Detector will attempt to categorize an incoming action string into broad categories of duration, which are: 

seconds, minutes, hours, days, weeks, years.

You can edit the fewshot in the text editor, but be aware that you must retain the fewshots data structure so processing will work.`;

export class TimeDetectorComponent extends ThothComponent {
  constructor() {
    super("Time Detector");

    this.task = {
      outputs: { detectedTime: "output", trigger: "option" }
    };

    this.category = "AI/ML";
    this.display = true;
    this.info = info;
  }

  builder(node: ThothNode) {
    node.data.fewshot = fewshot;
    const inp = new Rete.Input("string", "Text", stringSocket);
    const out = new Rete.Output("detectedTime", "Time Detected", stringSocket);
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

  async worker(node: NodeData, inputs: ThothWorkerInputs, outputs: ThothWorkerOutputs, { silent, thoth }: { silent: boolean, thoth: EngineContext }) {
    const { completion } = thoth;
    const fewshot = node.data.fewshot as string
    const action = inputs["string"][0];
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
      detectedTime: result,
    };
  }
}
