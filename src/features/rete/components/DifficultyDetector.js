import Rete from "rete";
import { actionSocket, dataSocket, actionDifficultySocket } from "../sockets";
import { DisplayControl } from "../controls/DisplayControl";
import { FewshotControl } from "../dataControls/FewshotControl";
import { completion } from "../../../utils/openaiHelper";

// For simplicity quests should be ONE thing not complete X and Y
const fewshot = `Given an action, predict how hard it would be for a normal human in a fantasy world and what type of stat it uses.

Stat Types: Strength, Dexterity, Endurance, Intelligence, Charisma

Action, Difficulty, Type: throw an anvil at the man, 8/20, Strength
Action, Difficulty, Type: cast a fireball spell, 6/20, Intelligence
Action, Difficulty, Type: I'm confident that I can kill the dragon! 2/20, Charisma
Action, Difficulty, Type: convince the king to give you his kingdom, 13/20, Charisma
Action, Difficulty, Type: talk to the merchant, 1/20, Charisma
Action, Difficulty, Type: ask the man if you can jump on his back and ride him around, 11/20, Charisma
Action, Difficulty, Type: pick up the mountain, 20/20, Strength
Action, Difficulty, Type: enter the room and tell the governor that you'll slay the dragon, 4/20, Charisma
Action, Difficulty, Type: run away, 4/20, Dexterity
Action, Difficulty, Type: ask why the dragon has been attacking people, 2/20, Charisma
Action, Difficulty, Type: say something wise, 6/20, Intelligence
Action, Difficulty, Type: sees a massive dragon flying over head, 7/20, Luck
Action, Difficulty, Type: attack the Dragon, 6/20, Strength
Action, Difficulty, Type: continue harder and harder, 6/20, Endurance
Action, Difficulty, Type: feel pity for the gnome, 1/20, Charisma
Action, Difficulty, Type: set up a small blanket and pour the dragon a drink, 2/20, Dexterity
Action, Difficulty, Type: says "wait are you leaving me?", 2/20, Charisma
Action, Difficulty, Type: leap over the chasm, 7/20, Dexterity
Action, Difficulty, Type: talk to the bartender who gives you a pile of gold, 11/20, Luck
Action, Difficulty, Type: climb up the mountain, 6/20, Endurance
Action, Difficulty, Type: goes to talk to the king, 2/20, Charisma
Action, Difficulty, Type: ask who the evil demon king is, 2/20, Charisma
Action, Difficulty, Type: do a back flip, 6/20, Dexterity
Action, Difficulty, Type: `;

export class DifficultyDetectorComponent extends Rete.Component {
  constructor() {
    // Name of the component
    super("Difficulty Detector");

    this.task = {
      outputs: { actionDifficulty: "output", data: "option" },
    };
  }

  displayControl = {};

  builder(node) {
    node.data.fewshot = fewshot;
    const inp = new Rete.Input("action", "Action", actionSocket);
    const out = new Rete.Output(
      "actionDifficulty",
      "Action Difficulty",
      actionDifficultySocket
    );

    const dataInput = new Rete.Input("data", "Data", dataSocket);
    const dataOutput = new Rete.Output("data", "Data", dataSocket);

    const display = new DisplayControl({
      key: "display",
    });

    const fewshotControl = new FewshotControl();

    node.inspector.add(fewshotControl);

    this.displayControl = display;

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(out)
      .addControl(display);
  }

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
      actionDifficulty: result,
    };
  }
}
