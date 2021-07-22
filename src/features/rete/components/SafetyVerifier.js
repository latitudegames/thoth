import Rete from "rete";
import { stringSocket, dataSocket, booleanSocket } from "../sockets";
import { FewshotControl } from "../dataControls/FewshotControl";
import { DisplayControl } from "../controls/DisplayControl";
import { completion } from "../../../utils/openaiHelper";

const fewshot = `Rate the actions according to the following content categories
X: Explicit sexual content, rape, cannibalism, incest
M: Heavy violence, light sexual content, safe for adults
T: Light violence, safe for teens.
E: Safe for everyone

Action: dodge and fire a silver arrow.
Rating: E

Action: Kiss her chest
Rating: M

Action: Cum in the pig's mouth
Rating: X

Action: Lick the woman's pussy
Rating: X

Action: Behead the peasant with your axe
Rating: M

Action: pull out elon musks not a flamethrower to burn the dragon
Rating: T

Action: melt gold in cave and cover dragon with the melted gold
Rating: T

Action: Laughed you figured your sister and fucked your best friend.
Rating: X

Action: pick up governor and toss him out the window like from the emperors groove, with him screaming SORRRY
Rating: T

Action: Rub the woman's genitals
Rating: X

Action: Stroke the persons boobs
Rating: X

Action: Pick up the bartender
Rating: T

Action: Ask the guard why he's here.
Rating: E

Action: Release the biggest load in the universe
Rating: X

Action: Cast a spell to summon a fireball
Rating: T

Action: Have sex with her
Rating: X

Action: Take out my flamethrower
Rating: T

Action: Slice off the bandit's head
Rating: M

Action: Jerk off
Rating: X

Action: `;

export class SafetyVerifier extends Rete.Component {
  constructor() {
    // Name of the component
    super("Safety Verifier");

    this.task = {
      outputs: {
        data: "option",
        boolean: "output",
      },
    };
    this.category = "AI/ML"
  }

  displayControl = {};

  builder(node) {
    node.data.fewshot = fewshot;

    const inp = new Rete.Input("string", "Text", stringSocket);
    const dataInput = new Rete.Input("data", "Data", dataSocket);
    const dataOutput = new Rete.Output("data", "Data", dataSocket);
    const out = new Rete.Output("boolean", "Boolean", booleanSocket);

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

  async worker(node, inputs, outputs) {
    const action = inputs["string"][0];
    const prompt = node.data.fewshot + action + "\nRating:";

    const body = {
      prompt,
      stop: ["\n"],
      maxTokens: 10,
      temperature: 0.0,
    };
    const raw = await completion(body);
    const result = raw.trim() !== "X";

    this.displayControl.display(`${result}`);

    return {
      boolean: result,
    };
  }
}
