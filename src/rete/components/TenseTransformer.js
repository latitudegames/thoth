import Rete from "rete";
import { stringSocket, actionSocket } from "../sockets";
import { DisplayControl } from "../controls/DisplayControl";
import { completion } from "../../utils/openaiHelper";

const fewShots = `Change each statement to be in the third person present tense and correct all grammar.

Matt: am sleepy.
Third Person: Matt is sleepy.
---
Matt: bllogha bloghs.
Third Person: Matt makes nonsensical sounds.
--
Jackson: tell the king that you won't help him.
Third Person: Jackson tells the king that he won't help him.
---
Jill: can I have a mug of ale?
Third Person: Jill says, "Can I have a mug of ale?"
---
Sam: say i'd be happy to help you
Third Person: Sam says, "I'd be happy to help you."
---
Cogsworth: draw my sword of light and slice myself in the forehead.
Third Person: Cogsworth draws his sword of light and slices himself in the forehead.
---
Jon: say but you said I could have it. Please?
Third Person: Jon says, "But you said I could have it. Please?"
---
Eliza: ask my friend where he's going
Third Person: Eliza asks her friend where he's going.
---
Aaron: am sleepy.
Third Person: Aaron is sleepy.
---
Robert: say I think I can resist it if you give me potion of Mind Shield. Do u have one?
Third Person: Robert says, "I think I can resist it if you give me a potion of Mind Shield. Do you have one?"
---
Jack: go talk to the knight
Third Person: Jack goes to talk to the knight
---
Jack: say What are you doing?!
Third Person: Jack says, "What are you doing?!"
---
James: I'm confident that I can kill the dragon!
Third Person: James says, "I'm confident that I can kill the dragon!"
---
Erica: want to go to the store but trip over my own shoes.
Third Person: Erica wants to go to the store but she trips over her own shoes.
---
Tom: told her that it was over.
Third Person: Tom told her that it was over.
---
Fred: ask what time is it?
Third Person: Fred asks, "What time is it?"
---
James: okay!
Third Person: James says, "Okay!"
--
Fred: command the mercenaries to attack the dragon while you rescue the princess.
Third Person: Fred commands the mercenaries to attack the dragon while he rescues the princess.
---
`;
export class TenseTransformer extends Rete.Component {
  constructor() {
    // Name of the component
    super("Tense Transformer");
  }

  displayControl = {};

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have garbbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node) {
    // create inputs here. First argument is th ename, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const inp = new Rete.Input("text", "String", stringSocket);
    const out = new Rete.Output("action", "Action", actionSocket);

    // controls are the internals of the node itself
    // This default control simple has a text field.
    const display = new DisplayControl({
      key: "display",
      defaultDisplay: "awaiting response",
    });
    this.displayControl = display;

    return node.addInput(inp).addOutput(out).addControl(display);
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connecte components
  async worker(node, inputs, outputs) {
    // AD ON INPUT

    const body = {
      prompt: fewShots,
      stop: ["\n"],
      maxTokens: 100,
      temperature: 0.0,
    };
    const result = await completion(body);

    this.displayControl.display(result);

    outputs["action"] = result;
  }
}
