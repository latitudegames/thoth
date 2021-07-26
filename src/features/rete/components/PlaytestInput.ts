import Rete from "rete";
import { ThothReteComponent } from "./ThothReteComponent";
import { triggerSocket, stringSocket } from "../sockets";

const info = `The Playtest Input component is connected to the playtest window. It received anything which is type dinto the playtest areavia the input and will trigger the running of your spell chain.`;
export class PlaytestInput extends ThothReteComponent {
  constructor() {
    // Name of the component
    super("Playtest Input");

    this.task = {
      outputs: {
        text: "output",
        trigger: "option",
      },
      init: (task) => {
        this.initialTask = task;
      },
    };

    this.category = "I/O";
    this.display = true;
    this.info = info;
  }

  displayControl = {};
  unsubscribe = null;

  subscribeToPlaytest(node) {
    const { subscribe, events } = this.editor.pubSub;

    this.unsubscribe = subscribe(events.PLAYTEST_INPUT, (_, text) => {
      // attach the text to the nodes data for access in worker
      node.data.text = text;

      // will need to run this here with the stater rather than the text
      this.initialTask.run(text);
      this.initialTask.reset();
      this.editor.trigger("process");
    });
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have garbbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node) {
    if (this.unsubscribe) this.unsubscribe();
    this.unsubscribe = null;

    // create inputs here. First argument is th ename, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const dataOutput = new Rete.Output("trigger", "Trigger", triggerSocket);
    const textOutput = new Rete.Output("text", "Text", stringSocket);

    this.subscribeToPlaytest(node);

    return node.addOutput(textOutput).addOutput(dataOutput);
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connecte components
  worker(node, inputs, text) {
    node.display(text);

    return {
      text,
    };
  }
}
