import Rete from "rete";
import { stringSocket, dataSocket, actionDifficultySocket } from "../sockets";
import { DisplayControl } from "../controls/DisplayControl";
import { completion } from "../../utils/openaiHelper";

// For simplicity quests should be ONE thing not complete X and Y
const fewShots = `Given an action, predict how hard it would be for a normal human in a fantasy world and what type of stat it uses.

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
Action, Difficulty, Type: `

export class DifficultyDetectorComponent extends Rete.Component {
  constructor() {
    // Name of the component
    super("Difficulty Detector");

    this.task = {
      outputs: { actionDifficulty: "output", data: "option" },
    };
  }

  displayControl = {};

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have grabbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node) {
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const inp = new Rete.Input("string", "Text", stringSocket);
    const out = new Rete.Output("actionDifficulty", "Action Difficulty", actionDifficultySocket);
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
        actionDifficulty: result,
    };
  }
}
